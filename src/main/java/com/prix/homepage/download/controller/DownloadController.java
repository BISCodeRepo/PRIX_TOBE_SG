package com.prix.homepage.download.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * prix.hanyang.ac.kr/download 페이지
 */
@Controller
@RequestMapping("/download")
public class DownloadController {

  /**
   * prix.hanyang.ac.kr/download로의 get request 매핑
   * 
   * @return download/download.html 렌더링
   */
  @GetMapping("")
  public String gotoDownloadPage() {
    return "/download/download";
  }

  /**
   * prix.hanyang.ac.kr/modplus로의 get request 매핑
   * 
   * @return download/modplus.html 렌더링
   */
  @GetMapping("/modplus")
  public String gotoModplusPage() {
    return "download/modplus";
  }

}
