package com.prix.homepage.livesearch.service.impl;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import com.prix.homepage.livesearch.dao.SearchLogMapper;
import com.prix.homepage.livesearch.pojo.ACTGResultDto;
import com.prix.homepage.livesearch.pojo.SearchLog;

import java.io.*;
import java.util.zip.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

/*
 * ACTG result 작업 처리
 */
@Service
@AllArgsConstructor
public class ACTGResultService {

  private final SearchLogMapper searchLogMapper;

  public ACTGResultDto result(HttpServletRequest request, HttpSession session) {
    final String logDir = "/home/PRIX/ACTG_log/";
    final String logDB = "/home/PRIX/ACTG_db/";

    final String anony = "4";
    String id = String.valueOf(session.getAttribute("id"));
    if (id == null) {
      session.setAttribute("id", anony);
      id = String.valueOf(session.getAttribute("id"));
    }

    String userName = null;
    String title = null;

    String index = request.getParameter("index");
    String key = id + "_" + index;
    String xmlPath = "param_" + key + ".xml";
    String SAVOutput = "SAV_peptide_" + key + ".txt";
    String NOROutput = "NOR_peptide_" + key + ".txt";
    String VSGGFFOutput = "VSG_peptide_" + key + ".gff";
    String VSGFlatOutput = "VSG_peptide_" + key + ".flat";
    String VSGLogOutput = "VSG_peptide_" + key + ".log";
    String SFTFlatOutput = "SFT_peptide_" + key + ".flat";
    String SFTGFFOutput = "SFT_peptide_" + key + ".gff";

    String[] files = new String[7];
    files[0] = SAVOutput;
    files[1] = NOROutput;
    files[2] = VSGGFFOutput;
    files[3] = VSGFlatOutput;
    files[4] = VSGLogOutput;
    files[5] = SFTFlatOutput;
    files[6] = SFTGFFOutput;

    LocalDate date = null;

    
    SearchLog searchLog = null;
    if(index != null){
      searchLog = searchLogMapper.getSearchLog(index);
    }
    if (searchLog != null) {
      title = searchLog.getTitle();
      userName = String.valueOf(searchLog.getUserId());
      date = searchLog.getDate();
    }
    userName = searchLogMapper.getUserNameById(userName);

    String method = null;
    String IL = null;
    String proteinDB = null;
    String SAV = null;
    String variantSpliceGraphDB = null;
    String altAD = null;
    String exonSkipping = null;
    String intron = null;
    String mutation = null;
    String referenceGenome = null;
    String proteinOption = "";
    String VSGOption = "";

    try {
      FileReader FR = new FileReader(logDir + xmlPath);
      BufferedReader BR = new BufferedReader(FR);
      String line = null;
      while ((line = BR.readLine()) != null) {
        if (line.contains("MappingMethod")) {
          method = line.split("@")[1];
        } else if (line.contains("ILSame")) {
          IL = line.split("@")[1];
          if (IL.equalsIgnoreCase("yes")) {
            IL = "Isoleucine is equivalent to leucine";
          } else {
            IL = "";
          }
        } else if (line.contains("graphFile")) {
          variantSpliceGraphDB = line.split("@")[1];
          variantSpliceGraphDB = variantSpliceGraphDB.replace(logDB, "");
        } else if (line.contains("type=\"proteinDB\"")) {
          proteinDB = line.split("@")[1];
          proteinDB = proteinDB.replace(logDB, "");
        } else if (line.contains("JunctionVariation")) {
          altAD = line.split("@")[1];
          if (altAD.equalsIgnoreCase("yes")) {
            altAD = "junction variation";
          } else {
            altAD = "";
          }

          if (altAD.length() != 0) {

            if (VSGOption.length() != 0) {
              VSGOption = VSGOption + ", " + altAD;
            } else {
              VSGOption = altAD;
            }

          }
        } else if (line.contains("ExonSkipping")) {
          exonSkipping = line.split("@")[1];
          if (exonSkipping.equalsIgnoreCase("yes")) {
            exonSkipping = "exon skipping";
          } else {
            exonSkipping = "";
          }

          if (exonSkipping.length() != 0) {

            if (VSGOption.length() != 0) {
              VSGOption = VSGOption + ", " + exonSkipping;
            } else {
              VSGOption = exonSkipping;
            }

          }
        } else if (line.contains("IntronMapping")) {
          intron = line.split("@")[1];
          if (intron.equalsIgnoreCase("yes")) {
            intron = "intron mapping";
          } else {
            intron = "";
          }

          if (intron.length() != 0) {

            if (VSGOption.length() != 0) {
              VSGOption = VSGOption + ", " + intron;
            } else {
              VSGOption = intron;
            }

          }
        } else if (line.contains("<Mutation>")) {
          mutation = line.split("@")[1];
          mutation = mutation.replace(logDir, "");

          if (mutation.length() != 0) {
            mutation = "mutation";
            if (VSGOption.length() != 0) {
              VSGOption = VSGOption + ", " + mutation;
            } else {
              VSGOption = mutation;
            }

          }
        } else if (line.contains("referenceGenome")) {
          referenceGenome = line.split("@")[1];
          referenceGenome = referenceGenome.replace(logDB, "");
        } else if (line.contains("SAV")) {
          SAV = line.split("@")[1];
          if (SAV.equalsIgnoreCase("yes")) {
            SAV = "single amino-acid variation";
          } else {
            SAV = "";
          }

          proteinOption = SAV;
        }
      }

      BR.close();
      FR.close();

    } catch (IOException e) {

    }

    // Make Zip file
    try {
      byte[] buf = new byte[1024];
      String zip = logDir + index + ".zip";

      File zipFile = new File(zip);
      if (!zipFile.exists()) {
        ZipOutputStream outZip = new ZipOutputStream(new FileOutputStream(zip));
        for (int i = 0; i < files.length; i++) {
          File file = new File(logDir + files[i]);
          if (!file.exists()) {
            continue;
          }

          FileInputStream in = new FileInputStream(file);
          outZip.putNextEntry(new ZipEntry(files[i]));

          int len;
          while ((len = in.read(buf)) > 0) {
            outZip.write(buf, 0, len);
          }

          outZip.closeEntry();
          in.close();
        }

        outZip.close();
      }

    } catch (Exception e) {

    }
    return ACTGResultDto.builder().date(date).userName(userName).title(title).method(method).IL(IL).proteinDB(proteinDB)
        .proteinOption(proteinOption).VSGOption(VSGOption).variantSpliceGraphDB(variantSpliceGraphDB).index(index)
        .build();
  }// result
}
