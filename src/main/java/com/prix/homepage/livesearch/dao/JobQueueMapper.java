package com.prix.homepage.livesearch.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.prix.homepage.livesearch.pojo.JobQueue;

@Mapper
@Repository
public interface JobQueueMapper {
  void insert(Integer userId, String jobCode, String title);

  //select id from px_job_queue where user_id=" + id + " and job_code='" + jobCode + "';"
  Integer selectId(Integer userId, String jobCode);

  void delete(String jobCode);

  List<JobQueue> selectJCandTitle(@Param("userId") Integer userId);
}
