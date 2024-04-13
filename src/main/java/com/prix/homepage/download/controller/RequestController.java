package com.prix.homepage.download.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * prix.hanyang.ac.kr/request?software=example 페이지
 * prix.hanyang.ac.kr/download/example에서 software download 클릭시 이동
 */
@Controller
public class RequestController {

  /**
   * prix.hanyang.ac.kr/reuqest?software= 로의 get reuqest 매핑
   * 
   * @param software download 요청한 소프트웨어 이름
   * @param model    download/request.html에서 소프트웨어명 전달 용도
   * @return download/request.html 렌더링
   */
  @GetMapping("/request")
  public String gotoRequestSoftwaredPage(@RequestParam String software, Model model) {
    model.addAttribute("software", software);
    return "/download/request";
  }
}
