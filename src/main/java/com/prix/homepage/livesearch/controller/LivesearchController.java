package com.prix.homepage.livesearch.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * prix.hanyang.ac.kr/livesearch 페이지
 */
@Controller
public class LivesearchController {

  /**
   * prix.hanyang.ac.kr/livesearch로의 get request 매핑
   * @return livesearch/livesearch.html 렌더링
   */
  @GetMapping("/livesearch")
  public String gotoLivesearchPage() {
      return "/livesearch/livesearch";
  }

  /**
   * .prix.hanyang.ac.kr/modplus/search로의 get request 매핑
   * @return livesearch/modplus/search.html 렌더링
   */
  @GetMapping("/modplus/search")
  public String gotoModplusSearchPage() {
      return "/livesearch/modplus/search";
  }
}
