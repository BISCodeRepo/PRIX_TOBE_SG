package com.prix.homepage.user.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.prix.homepage.user.dao.ModificationLogMapper;
import com.prix.homepage.user.pojo.ModificationLog;
import com.prix.homepage.user.service.ModificationLogService;

import lombok.AllArgsConstructor;

/**
 * ModificationLog 객체와 관련된 서비스
 */
@AllArgsConstructor
@Service
public class ModificationLogServiceImpl implements ModificationLogService{

  private final ModificationLogMapper modificationLogMapper;

  /**
   * db에서 px_modification_log 테이블의 데이터를 모두 가져옴
   */
  @Override
  public List<ModificationLog> getAllModificationLog() {
    List<ModificationLog> listModificationLogs = modificationLogMapper.findAll();

    List<ModificationLog> listModificationLog = new ArrayList<>();
    for(ModificationLog modificationLog : listModificationLogs){
      listModificationLog.add(
        ModificationLog.builder()
            .id(modificationLog.getId())
            .date(modificationLog.getDate())
            .version(modificationLog.getVersion())
            .file(modificationLog.getFile())  
            .build()
      );
    }

    return listModificationLog;
  }
  
}
