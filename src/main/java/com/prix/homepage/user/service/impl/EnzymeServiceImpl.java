package com.prix.homepage.user.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.prix.homepage.user.dao.EnzymeMapper;
import com.prix.homepage.user.pojo.Enzyme;
import com.prix.homepage.user.service.EnzymeService;

import lombok.AllArgsConstructor;

/**
 * Enzyme 객체와 관련된 서비스
 */
@AllArgsConstructor
@Service
public class EnzymeServiceImpl implements EnzymeService{
  
  private final EnzymeMapper enzymeMapper;

  /**
   * db에서 userId가 일치하는 px_enzyme 테이블 상의 데이터를 모두 가져옴
   */
  @Override
  public List<Enzyme> getAllEnzymeByUserId(Integer userId) {
    List<Enzyme> listEnzymes =  enzymeMapper.findByUserId(userId);

    List<Enzyme> listEnzyme = new ArrayList<>();

    for(Enzyme enzyme : listEnzymes){
      listEnzyme.add(
        Enzyme.builder()
            .id(enzyme.getId())
            .name(enzyme.getName())
            .user_id(enzyme.getUser_id())
            .ct_cleave(enzyme.getCt_cleave())
            .nt_cleave(enzyme.getNt_cleave())
            .build()
      );
    }

    return listEnzyme;
  }

}
