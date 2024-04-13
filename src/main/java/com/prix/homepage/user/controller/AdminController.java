package com.prix.homepage.user.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.prix.homepage.user.pojo.Account;
import com.prix.homepage.user.service.AccountService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

/**
 * prix.hanyang.ac.kr/admin 페이지
 * 헤더에서 admin 클릭시 이동
 */
@Controller
@AllArgsConstructor
public class AdminController {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final AccountService accountService;

    /**
     * prix.hanyang.ac.kr/admin/adlogin로의 get request 매핑
     * 
     * @param model     뷰에 dummy account 전달 용도
     * @param paramsMap prix.hanyang.ac.kr/admin/adlogin?action=param 에서 param 매핑
     * @param request   세션 접근 용도
     */
    @GetMapping("/admin/adlogin")
    public String gotoAdminLoginnPage(Model model, @RequestParam(required = false) Map<String, String> paramsMap,
            HttpServletRequest request) {

        HttpSession session = request.getSession();
        // 로그아웃 요청시 세션에서 id와 level을 삭제하고 admin/login으로 redirect
        if (paramsMap.containsKey("action") && paramsMap.get("action").equalsIgnoreCase("logout")) {
            session.removeAttribute("id");
            session.removeAttribute("level");
            return "redirect:admin/login";
        }

        // admin이 로그인된 상태라면 configuration
        Integer level = (Integer) session.getAttribute("level");
        if (level != null) {
            switch (level) {
                case 1:
                    return "redirect:/admin/index";
                case 2:
                    return "redirect:/admin/configuration";
                default:
                    break;
            }
        }

        // 뷰에 보낼 dummy account
        Account accountDto = Account.builder()
                .userid(null)
                .password("")
                .name(null)
                .email(null)
                .affiliation(null)
                .level(2)
                .build();

        model.addAttribute("accountDto", accountDto);
        return "admin/adlogin";
    }

    /**
     * prix.hanyang.ac.kr/admin/adlogin으로의 post mapping
     * 
     * @param model      로그인 실패시 뷰에 dummy account와 에러 메시지 전달 용도
     * @param accountDto 뷰에서 입력받은 account
     * @param result     validation으로 검사한 결과
     * @param request    세션 접근 용도
     */
    @PostMapping("/admin/adlogin")
    public String adlogin(Model model, @Valid Account accountDto, BindingResult result,
            HttpServletRequest request) {

        // 입력한 account의 validation 실패 유무 확인
        if (result.hasErrors()) {
            logger.warn("failed in validation");
            for (ObjectError error : result.getAllErrors()) {
                logger.warn("reasons for validation failure: " + error.getDefaultMessage());
            }
            model.addAttribute("accountDto", accountDto);
            return "admin/adlogin";
        }

        // 입력받은 email과 password로 db에서 검색한다
        Account account = accountService.findByEmailAndPassword(accountDto.getEmail(),
                accountDto.getPassword());

        if (account == null) {
            logger.warn("account does not exist");
            model.addAttribute("accountDto", accountDto);
            return "admin/adlogin";
        }

        // 세션에 id(PK) 와 level 저장
        HttpSession session = request.getSession();
        session.setAttribute("id", account.getId());
        session.setAttribute("level", account.getLevel());

        logger.info("ID registered in session:" + session.getAttribute("id"));

        // account가 admin이면 admin/configuration으로 redirect
        if (account.getLevel() > 1) {
            return "redirect:/admin/configuration";
        }
        // 로그인 성공시 초기 페이지로 이동
        return "redirect:/";
    }

    /**
     * prix.hanyang.ac.kr/admin/index으로의 get request 매핑
     * admin이 아닐 경우 보여주는 페이지
     */
    @GetMapping("/admin/index")
    public String gotoAdminIndexPage() {
        return "admin/index";
    }

}
