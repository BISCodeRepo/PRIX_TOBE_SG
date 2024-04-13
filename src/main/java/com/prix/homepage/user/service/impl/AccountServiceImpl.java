package com.prix.homepage.user.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prix.homepage.user.dao.AccountMapper;
import com.prix.homepage.user.pojo.Account;
import com.prix.homepage.user.service.AccountService;

import java.util.Optional;

import lombok.AllArgsConstructor;

/**
 * Account 객체와 관련된 서비스
 */
@AllArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {

  private final AccountMapper accountMapper;
  private final PasswordEncoder passwordEncoder;
  private final Logger logger = LoggerFactory.getLogger(this.getClass());

  /**
   * account를 db에 저장
   */
  @Override
  public void saveAccount(Account accountDto) {
    String encodedPassword = passwordEncoder.encode(accountDto.getPassword());
    logger.info("encodedPW: {}", encodedPassword);

    accountMapper.insert(
        Account.builder()
            .id(accountDto.getId())
            .userid(accountDto.getUserid())
            .password(encodedPassword)
            .name(accountDto.getName())
            .email(accountDto.getEmail())
            .affiliation(accountDto.getAffiliation())
            .level(accountDto.getLevel())
            .build());
  }

  /**
   * id로 db에서 account를 찾아서 리턴
   */
  @Override
  public Account getAccount(int id) {
    Optional<Account> optionalAccount = accountMapper.selectById(id);
    Account account = optionalAccount.orElse(null);

    return account;
  }

  /**
   * db에서 id에 일치하는 account 삭제
   */
  @Override
  public void deleteAccount(int id) throws Exception {
    accountMapper.deleteById(id);
  }

  /**
   * db에서 email이 일치하는 account 찾아서 리턴
   */
  @Override
  public boolean isEmailExists(String email) {
    logger.info("email check");
    return accountMapper.isEmailExists(email);
  }

  /**
   * email과 password로 db에서 찾아서 account 리턴
   * passwordEncoder로 암호화된 비밀번호와 입력받은 비밀번호 일치 여부 확인
   */
  @Override
  public Account findByEmailAndPassword(String email, String password) {
    Optional<Account> optionalAccount = accountMapper.findByEmail(email);
    Account account = optionalAccount.orElse(null);
    if (account != null && passwordEncoder.matches(password, account.getPassword())) {
      return account;
    }
    return null;
  }
}
