package com.prix.homepage.user.service.impl;

import java.util.List;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.prix.homepage.user.dao.SoftwareMsgMapper;
import com.prix.homepage.user.pojo.SoftwareMsg;
import com.prix.homepage.user.service.SoftwareMsgService;

import lombok.AllArgsConstructor;

/**
 * SoftwareLog 객체와 관련된 서비스
 */
@AllArgsConstructor
@Service
public class SoftwareMsgServiceImpl implements SoftwareMsgService{

  private final SoftwareMsgMapper softwareMsgMapper;

  /**
   * db에서 px_software_msg 테이블에서 id와 일치하는 데이터를 가져옴
   */
  @Override
  public List<SoftwareMsg> getAllSoftwareMsgById(String id) {
    List<SoftwareMsg> listsSoftwareMsgs = softwareMsgMapper.findById(id);
    
    List<SoftwareMsg> listSoftwareMsg = new ArrayList<>();
    for(SoftwareMsg softwareMsg : listsSoftwareMsgs){
      listSoftwareMsg.add(
        SoftwareMsg.builder()
            .id(softwareMsg.getId())
            .message(softwareMsg.getMessage())
            .build()
      );
    }

    return listSoftwareMsg;
  }

  
}
