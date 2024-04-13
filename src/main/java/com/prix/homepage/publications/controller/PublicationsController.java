package com.prix.homepage.publications.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * prix.hanyang.ac.kr/publications 페이지
 */
@Controller
@RequestMapping("/publications")
public class PublicationsController {

  /**
   * prix.hanyang.ac.kr/publications로의 get request 매핑
   * 
   * @return publications.publications.html 렌더링
   */
  @GetMapping("")
  public String gotoPublicationsPage() {
    return "publications/publications";
  }

}
