package com.prix.homepage.user.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * prix.hanyang.ac.kr 페이지
 * 초기 페이지
 */
@Controller
public class IntroductionController {
  
  @GetMapping("/")
  public String gotoIntroductionPage() {
      return "index";
  }

    /**
     * header에서 help 클릭시
     * 
     * @return help.html 렌더링
     */
  @GetMapping("/help")
  public String gotoHelpPage() {
      return "help";
  }

    /**
     * header에서 contact 클릭시
     * 
     * @return contact.html 렌더링
     */
  @GetMapping("/contact")
  public String gotoContactPage() {
      return "contact";
  }
  
}
