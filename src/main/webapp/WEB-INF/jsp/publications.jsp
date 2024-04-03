<jsp:include page="./inc/publications.jsp" flush="true" />
<!-- header ��-->

<table width="990" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td width="10" height="100%" rowspan="2" align="right" valign="top" style="padding-right:15px">
		&nbsp;
	</td>

    <td height="10" valign="top">
	
		<table border="0" cellspacing="0" cellpadding="0" id="TitTable">
		  <tr>
			<td align="left"><font class="drakBR" size="3">PUBLICATIONS</td>
			<td align="right" valign="bottom" style="padding-right:5px;"><table border="0" cellspacing="0" cellpadding="0">
<%
	if( session.getAttribute("id") != null && !session.getAttribute("id").equals("4") )
	{
%>
          <tr>
            <td><img src="/images/top_icon_01.gif" width="2" height="9"> &nbsp;<a href="modplus/history.jsp" class="menu">History</a> &nbsp; &nbsp;</td>
            <td><img src="/images/top_icon_01.gif" width="2" height="9"> &nbsp;<a href="login.jsp?action=logout" class="menu">Logout</a> &nbsp; &nbsp;</td>
          </tr>
<%
	}
%>
			 </table></td>
		  </tr>
		</table>
		<table width="650" border="0" align="left" cellpadding="1">
	         <tr>
			  <td align="left"><img src="images/p_st1.GIF" width="4" height="9"><font class="drakBR"> MutCombinator</font> ( <a href="download/mutcombinator.jsp">Software download</a> )<hr><font class="drakBR">MutCombinator: identification of mutated peptides allowing combinatorial mutations using nucleotide-based graph search.</font><br></font><em>Seunghyuk Choi and Eunok Paek.</em><br>Bioinformatics, 2020, 7, i203-i209. <a href="https://pubmed.ncbi.nlm.nih.gov/32657416/" target="_blank" class="under">[ PMID: 32657416 ]</a><br><br></td>
			</tr>
			<tr>
			  <td align="left"><img src="images/p_st1.GIF" width="4" height="9"><font class="drakBR"> MODplus</font> ( <a href="download/modplus.jsp">Software download</a> )<hr><font class="drakBR">MODplus: Robust and Unrestrictive Identification of Post-Translational Modifications Using Mass Spectrometry.</font><br></font><em>Seunjin Na, Jihyung Kim and Eunok Paek.</em><br>Analytical Chemistry, 2019, 91, 17, 11324-11333. <a href="https://pubmed.ncbi.nlm.nih.gov/31365238/" target="_blank" class="under">[ PMID: 31365238 ]</a><br><br></td>
			</tr>
			 <tr>
			  <td align="left"><img src="images/p_st1.GIF" width="4" height="9"><font class="drakBR"> deMix</font> ( <a href="download/demix.jsp">Software download</a> )<hr><font class="drakBR">deMix: Decoding Deuterated Distributions from Heterogeneous Protein States vis HDX-MS</font><br></font><em>Seungjin Na, Jae-Jin Lee, Jong Wha J. Joo, Kong-Joo Lee and Eunok Paek.</em><br>Scientific Reports, 2019, 9, 3176. <a href="https://pubmed.ncbi.nlm.nih.gov/30816214/" target="_blank" class="under">[ PMID: 30816214 ]</a><br><br></td>
			</tr>
			<tr>
			  <td align="left"><img src="images/p_st1.GIF" width="4" height="9"><font class="drakBR"> ACTG</font> ( <a href="download/ACTG.jsp">Software download</a> )<hr><font class="drakBR">ACTG: novel peptide mapping onto gene models.</font><br></font><em>Seunghyuk Choi, Hyunwoo Kim, and Eunok Paek.</em><br>Bioinformatics, 2017, 33(8), 1218-1220. <a href="https://www.ncbi.nlm.nih.gov/pubmed/28031186" target="_blank" class="under">[ PMID: 28031186 ]</a><br><br></td>
			</tr>

			<tr>
			  <td align="left"><img src="images/p_st1.GIF" width="4" height="9"><font class="drakBR"> NextSearch</font> ( <a href="download/nextsearch.jsp">Software download</a> )<hr><font class="drakBR">NextSearch: A Search Engine for Mass Spectrometry Data against a Compact Nucleotide Exon Graph.</font><br></font><em>Hyunwoo Kim, Heejin Park, and Eunok Paek.</em><br>Journal of Proteome Research, 2015, 14(7), 2784-2791. <a href="http://www.ncbi.nlm.nih.gov/pubmed/26004133" target="_blank" class="under">[ PMID: 26004133 ]</a><br><br></td>
			</tr>
			<!--tr>
			<td align="left">We provide the software programs listed below for non-profit purposes. To obtain it, you need to send us email including your name, affiliation, and title infromation.<br><br></td>
			</tr-->
			
			<tr>
			  <td align="left"><img src="images/p_st1.GIF" width="4" height="9"><font class="drakBR"> MODa</font> ( <a href="download/moda.jsp">Software download</a> )<hr><font class="drakBR">Fast multi-blind modification search through tandem mass spectrometry.</font><br></font><em>Seungjin Na, Nuno Bandeira, and Eunok Paek.</em><br>Molecular and Cellular Proteomics, 2012, 11, M111.010199. <a href="http://www.ncbi.nlm.nih.gov/pubmed/22186716" target="_blank" class="under">[ PMID: 22186716 ]</a><br><br></td>
			</tr>	
			<!--tr>
			  <td align="left"><font color="#990000">MODa Software Release Note:</font><br>
			  &nbsp;&nbsp;- version 1.02 (Oct 01, 2012) : <a href="request.jsp?software=MODa">download</a><br>
			  &nbsp;&nbsp;- version 1.01 (Mar 01, 2012)<br><br>
			  </td>
			</tr-->
			<tr>
			  <td align="left"><img src="images/p_st1.GIF" width="4" height="9"><font class="drakBR"> DBond</font> ( <a href="download/dbond.jsp">Software download</a> )<hr><font class="drakBR">New algorithm for the identification of intact disulfide linkages based on fragmentation characteristics in tandem mass spectra.</font><br></font><em>Seonhwa Choi, Jaeho Jeong, Seungjin Na, Hyo Sun Lee, Hwa-Young Kim, Kong-Joo Lee, and Eunok Paek.</em><br>Journal of Proteome Research, 2010, 9, 626-635. <a href="http://www.ncbi.nlm.nih.gov/pubmed/19902913" target="_blank" class="under">[ PMID: 19902913 ]</a><br><br></td>
			</tr>	
			<!--tr>
			  <td align="left"><font color="#990000">DBond Software Release Note:</font><br>
			  &nbsp;&nbsp;- version 3.02 (Oct 01, 2012) : <a href="request.jsp?software=DBond">download</a><br>
			  &nbsp;&nbsp;- version 3.01 (Jan 01, 2012)<br><br>
			  </td>
			</tr-->

			<tr>
			  <td align="left"><img src="images/p_st1.GIF" width="4" height="9"><font class="drakBR"> MODmap<hr>Prediction of novel modifications by unrestrictive search of tandem mass spectra. <br></font><em>Seungjin Na and Eunok Paek.</em><br>Journal of Proteome Research, 2009, 8, 4418-4427. <a href="http://www.ncbi.nlm.nih.gov/pubmed/19658439" target="_blank" class="under">[ PMID: 19658439 ]</a><br><br></td>
			</tr>	

			<tr>
			  <td align="left"><img src="images/p_st1.GIF" width="4" height="9"><font class="drakBR"> MOD<sup>i</sup><hr>Unrestrictive identification of multiple post-translational modifications from tandem mass spectrometry using an error-tolerant algorithm based on an extended sequence tag approach. <br></font><em>Seungjin Na, Jaeho Jeong, Heejin Park, Kong-Joo Lee, and Eunok Paek.</em><br>Molecular and Cellular Proteomics, 2008, 7, 2452-2463. <a href="http://www.ncbi.nlm.nih.gov/pubmed/18701446" target="_blank" class="under">[ PMID: 18701446 ]</a><br><br></td>
			</tr>	
		</table>	
	</td>
  </tr>

</table>

<jsp:include page="./inc/footer.jsp" flush="true" />
