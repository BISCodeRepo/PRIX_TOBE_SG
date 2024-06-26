package com.prix.homepage.user.pojo;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enzyme {

  private Integer id;

  @NotNull
  private Integer user_id;

  @NotNull
  private String name;

  private String nt_cleave;

  private String ct_cleave;
  
}
