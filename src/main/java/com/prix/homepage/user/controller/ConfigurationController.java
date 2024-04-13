package com.prix.homepage.user.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.prix.homepage.user.pojo.Database;
import com.prix.homepage.user.pojo.Enzyme;
import com.prix.homepage.user.pojo.ModificationLog;
import com.prix.homepage.user.pojo.SoftwareLog;
import com.prix.homepage.user.pojo.SoftwareMsg;
import com.prix.homepage.user.service.DatabaseService;
import com.prix.homepage.user.service.EnzymeService;
import com.prix.homepage.user.service.ModificationLogService;
import com.prix.homepage.user.service.SoftwareLogService;
import com.prix.homepage.user.service.SoftwareMsgService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

/**
 * prix.hanyang.ac.kr/admin/configuration 페이지
 * admin이 admin 접속시 보여주는 페이지
 */
@Controller
@AllArgsConstructor
public class ConfigurationController {

    private final DatabaseService databaseService;
    private final EnzymeService enzymeService;
    private final ModificationLogService modificationLogService;
    private final SoftwareLogService softwareLogService;
    private final SoftwareMsgService softwareMsgService;


    /**
     * prix.hanyang.ac.kr/admin/configuration으로의 get request 매핑
     * 
     * @param model 뷰에 전달
     * @param request 세션 접근 용도
     */
    @GetMapping("/admin/configuration")
    public String gotoConfigurationPage(Model model, HttpServletRequest request) {
        // 세션에서 id, level 받고 admin 체크
        HttpSession session = request.getSession();
        Object idObject = session.getAttribute("id");
        Integer level = (Integer)session.getAttribute("level");
        if(idObject == null){
            return "redirect:/admin/adlogin";
        } else if(level == null || level <= 1){
            return "redirect:/admin/index";
        }
        
        // 1. px_database : id, name, file  # 비었으면 빈 List []
        List<Database> listDatabaseResponseDto = databaseService.getAllDatabase();
        model.addAttribute("listDatabaseResponseDto", listDatabaseResponseDto);
    
        // 2. px_enzyme : id, name, nt_cleave, ct_cleave where user_id = 0
        List<Enzyme> listEnzymeResponseDto = enzymeService.getAllEnzymeByUserId(0);
        model.addAttribute("listEnzymeResponseDto", listEnzymeResponseDto);
    
        // 3. px_modification_log :  date, version, file 
        List<ModificationLog> listModificationLogResponseDto = modificationLogService.getAllModificationLog();
        model.addAttribute("listModificationLogResponseDto", listModificationLogResponseDto);
    
        // 4. px_software_log :  name, date, version, file order by date, id
        List<SoftwareLog> listSoftwareLogResponseDto = softwareLogService.getAllSoftwareLog();
        model.addAttribute("listSoftwareLogResponseDto", listSoftwareLogResponseDto);
    
        // 5. px_software_msg :  message where id = 'mode', 'dbond', 'nextsearch', 'signature'
        List<SoftwareMsg> listSoftwareMsgMode= softwareMsgService.getAllSoftwareMsgById("mode");
        List<SoftwareMsg> listSoftwareMsgDbond = softwareMsgService.getAllSoftwareMsgById("dbond");
        List<SoftwareMsg> listSoftwareMsgNextsearch = softwareMsgService.getAllSoftwareMsgById("nextsearch");
        List<SoftwareMsg> listSoftwareMsgSignature = softwareMsgService.getAllSoftwareMsgById("signature");
        model.addAttribute("listSoftwareMsgMode", listSoftwareMsgMode);
        model.addAttribute("listSoftwareMsgDbond", listSoftwareMsgDbond);
        model.addAttribute("listSoftwareMsgNextsearch", listSoftwareMsgNextsearch);
        model.addAttribute("listSoftwareMsgSignature", listSoftwareMsgSignature);
        
        return "admin/configuration";
    }
    
}

