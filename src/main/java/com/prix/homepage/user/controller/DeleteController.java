package com.prix.homepage.user.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.prix.homepage.user.service.AccountService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

/**
 * prix.hanyang.ac.kr/deleteAccount 페이지
 * 로그인한 상태에서 헤더에서 delete 를 클릭할 경우 계정 삭제 페이지로 이동
 */
@Controller
@AllArgsConstructor
public class DeleteController {

  private final Logger logger = LoggerFactory.getLogger(this.getClass());
  private final AccountService accountService;

  @GetMapping("/deleteAccount")
  public String gotoDeleteAccountPage() {
    return "deleteAccount";
  }

  /**
   * deleteAccount 페이지에서 삭제 시도 post
   * 
   * @param paramsMap prix.hanyang.ac.kr/deleteAccount?action=param
   * @param request   세션 접근 용도
   */
  @PostMapping("/deleteAccount")
  public String deleteAccount(@RequestParam(required = true) Map<String, String> paramsMap,
      HttpServletRequest request) {

    if (paramsMap.containsKey("action") && paramsMap.get("action").equalsIgnoreCase("delete")) {
      HttpSession session = request.getSession();
      Integer idObject = (Integer) session.getAttribute("id");

      // session에 "id"가 존재하면
      if (idObject != null) {
        int id = idObject;
        logger.debug("ID of the account to be deleted: {}", id);
        try {
          accountService.deleteAccount(id);
        } catch (Exception e) {
          logger.error("ID that failed to be deleted : {}", id);
          return "redirect:/deleteAccount";
        }
        session.removeAttribute("id");
        session.removeAttribute("level");
      } else {
        logger.warn("Session does not have attribute 'id'.");

        return "redirect:/deleteAccount";
      }
    }
    return "redirect:/";
  }

}
