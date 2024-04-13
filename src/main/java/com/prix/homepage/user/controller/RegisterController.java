package com.prix.homepage.user.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.prix.homepage.user.pojo.Account;
import com.prix.homepage.user.pojo.NewAccount;
import com.prix.homepage.user.service.AccountService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

/**
 * prix.hanyang.ac.kr/registration
 * prix.hanyang.ac.kr/confirm_personalInfo
 * 회원가입 페이지
 * 헤더->login->register 클릭시 이동
 */
@Controller
@AllArgsConstructor
public class RegisterController {

  private final Logger logger = LoggerFactory.getLogger(this.getClass());
  private final AccountService accountService;

  /**
   * 로그인 페이지에서 register 클릭시 사용자 동의 받는 용도
   * 
   * @return confirm_personalInfo.html 렌더링
   */
  @GetMapping("/confirm_personalInfo")
  public String gotoConfirmPersonalInfoPage() {
    return "confirm_personalInfo";
  }

  /**
   * 사용자 동의 받고 나서 회원가입 페이지
   * 
   * @param model 뷰에 보낼 dummy account 담는 용도
   * @return registration.html 렌더링
   */
  @GetMapping("/registration")
  public String gotoRegistrationPage(Model model) {

    NewAccount newAccountDto = NewAccount.builder()
        .userid(null)
        .password("")
        .name(null)
        .email(null)
        .affiliation(null)
        .level(1)
        .confirmedPassword("")
        .build();

    model.addAttribute("newAccountDto", newAccountDto);

    return "registration";
  }

  /**
   * prix.hanyang.ac.kr/registration으로의 회원가입 post mapping
   * 
   * @param model         회원가입 실패시에 뷰에 dummy account, 에러 메시지 보내는 용도
   * @param newAccountDto 입력받은 NewAccount 객체
   * @param result        account의 validation 검사 결과
   */
  @PostMapping("/registration")
  public String registerNewUser(Model model, @Valid NewAccount newAccountDto, BindingResult result) {
    if (result.hasErrors()) {
      logger.warn("failed in validation");
      for (ObjectError error : result.getAllErrors()) {
        logger.warn("reasons for validation failure: " + error.getDefaultMessage());
      }
      model.addAttribute("newAccountDto", newAccountDto);
      return "registration";
    }

    // 비밀번호 확인
    if (!newAccountDto.getPassword().equals(newAccountDto.getConfirmedPassword())) {
      result.rejectValue("confirmedPassword", "password.mismatch", "Passwords do not match");
      logger.warn("Failed in the match test between password and confirmation password");
      model.addAttribute("newAccountDto", newAccountDto);
      return "registration";
    }
    // 이메일 중복 확인
    if (accountService.isEmailExists(newAccountDto.getEmail())) {
      result.rejectValue("email", "email.exists", "Email already exists");
      logger.warn("Failed in email duplication check");
      model.addAttribute("newAccountDto", newAccountDto);
      return "registration";
    }

    // 기존 prix의 jsp파일의 로직 그대로 이용
    String name = newAccountDto.getEmail();
    String job = "";

    // db 저장용으로 변환
    Account accountDto = Account.builder()
        .userid(newAccountDto.getUserid())
        .password(newAccountDto.getPassword())
        .name(name)
        .email(newAccountDto.getEmail())
        .affiliation(job)
        .level(newAccountDto.getLevel())
        .build();

    // db에 account 등록
    accountService.saveAccount(accountDto);

    // 회원가입 성공하면 login 페이지로 redirect
    return "redirect:login";
  }

}
