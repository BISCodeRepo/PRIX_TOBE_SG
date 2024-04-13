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
 * prix.hanyang.ac.kr/login 페이지
 * 헤더에서 로그인 클릭시 이동
 */
@Controller
@AllArgsConstructor
public class LoginController {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final AccountService accountService;

    /**
     * prix.hanyang.ac.kr/login으로의 get request 매핑
     * 
     * @param model     뷰로 보낼 dummy account
     * @param paramsMap prix.hanyang.ac.kr/login?action=param, 로그아웃 용도
     * @param request   세션 접근 용도
     */
    @GetMapping("/login")
    public String gotoLoginPage(Model model, @RequestParam(required = false) Map<String, String> paramsMap,
            HttpServletRequest request) {
        if (paramsMap.containsKey("action") && paramsMap.get("action").equalsIgnoreCase("logout")) {
            HttpSession session = request.getSession();
            session.removeAttribute("id");
            session.removeAttribute("level");
            return "redirect:/login";
        }

        Account accountDto = Account.builder()
                .userid(null)
                .password("")
                .name(null)
                .email(null)
                .affiliation(null)
                .level(1)
                .build();

        model.addAttribute("accountDto", accountDto);
        return "login/login";
    }

    /**
     * prix.hanyang.ac.kr/login에서 로그인 시도 post request 매핑
     * 
     * @param model      로그인 실패시 뷰에 보낼 dummy account와 에러 메시지 전달 용도
     * @param accountDto 입력받은 account 객체
     * @param result     account의 validation 검사 결과
     * @param request    세션 접근 용도
     */
    @PostMapping("/login")
    public String login(Model model, @Valid Account accountDto, BindingResult result,
            HttpServletRequest request) {

        if (result.hasErrors()) {
            logger.warn("failed in validation");
            for (ObjectError error : result.getAllErrors()) {
                logger.warn("reasons for validation failure: " + error.getDefaultMessage());
            }
            model.addAttribute("accountDto", accountDto);
            return "login/login";
        }
        Account account = accountService.findByEmailAndPassword(accountDto.getEmail(),
                accountDto.getPassword());

        if (account == null) {
            logger.warn("account does not exist");
            model.addAttribute("accountDto", accountDto);
            return "login/login";
        }
        // 세션에 id(PK) 저장
        HttpSession session = request.getSession();
        session.setAttribute("id", account.getId());
        session.setAttribute("level", account.getLevel());

        // 세션에 등록된 id를 로그에 출력
        logger.info("ID registered in session:" + session.getAttribute("id"));

        // 로그인 성공시 초기 페이지로 이동
        return "redirect:/";
    }

}
