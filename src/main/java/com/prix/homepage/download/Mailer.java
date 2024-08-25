// Source code is decompiled from a .class file using FernFlower decompiler.
package com.prix.homepage.download;

import java.util.Date;
import java.util.Properties;
import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.Message.RecipientType;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

public class Mailer {
   private static String owner = "Eunok Paek";
   private static String owner_site = "PRIX";
   private static String owner_email = "prix@hanyang.ac.kr";
   private static String cc_email = "prix@hanyang.ac.kr";

   public Mailer() {
   }

   public static void main(String[] args) throws Exception {
      new Mailer();
      System.out.println("BYE!!");
   }

   public void sendEmailToUser(String user, String to, String software, String sendmsg, String sig, String path) {
      try {
         Properties props = new Properties();
         props.put("mail.transport.protocol", "smtp");
         props.put("mail.smtp.host", "smtp.gmail.com");
         props.put("mail.smtp.port", "587");
         props.put("mail.smtp.auth", "true");
         props.put("mail.smtp.starttls.enable", "true");
         props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
         props.setProperty("mail.smtp.ssl.protocols", "TLSv1.2");
         SMTPAuthenticator auth = new SMTPAuthenticator();
         Session mailSession = Session.getDefaultInstance(props, auth);
         MimeMessage msg = new MimeMessage(mailSession);
         msg.setFrom(new InternetAddress(owner_email, owner));
         msg.setRecipients(RecipientType.TO, InternetAddress.parse(to, false));
         msg.setRecipients(RecipientType.BCC, InternetAddress.parse(cc_email, false));
         msg.setSubject(String.valueOf(software) + " software");
         msg.setSentDate(new Date());
         StringBuffer greeteing = new StringBuffer("Dear " + user + ",\n\n");
         greeteing.append(String.valueOf(sendmsg) + "\n\n");
         greeteing.append(sig);
         MimeMultipart mp = new MimeMultipart();
         MimeBodyPart text = new MimeBodyPart();
         text.setText(greeteing.toString());
         mp.addBodyPart(text);
         if (path != null && !path.equalsIgnoreCase("")) {
            MimeBodyPart attachment = new MimeBodyPart();
            FileDataSource file = new FileDataSource(path);
            attachment.setDataHandler(new DataHandler(file));
            attachment.setFileName(file.getName());
            mp.addBodyPart(attachment);
         }

         msg.setContent(mp);
         Transport.send(msg);
      } catch (Exception var16) {
         System.out.println("ERRR in sendMailToUser");
         var16.printStackTrace();
      }

   }

   public void sendEmailToMe(String subject, String name, String affiliation, String title, String email,
         String instrument) {
      try {
         Properties props = new Properties();
         props.put("mail.transport.protocol", "smtp");
         props.put("mail.smtp.host", "smtp.gmail.com");
         props.put("mail.smtp.port", "587");
         props.put("mail.smtp.auth", "true");
         props.put("mail.smtp.starttls.enable", "true");
         props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
         props.setProperty("mail.smtp.ssl.protocols", "TLSv1.2");
         SMTPAuthenticator auth = new SMTPAuthenticator();
         Session mailSession = Session.getDefaultInstance(props, auth);
         MimeMessage msg = new MimeMessage(mailSession);
         msg.setFrom(new InternetAddress(owner_email, owner_site));
         msg.setRecipients(RecipientType.TO, InternetAddress.parse(owner_email, false));
         msg.setSubject(subject);
         msg.setSentDate(new Date());
         StringBuffer user_info = new StringBuffer();
         user_info.append("Name: " + name + "\r\n");
         user_info.append("Affiliation: " + affiliation + "\r\n");
         user_info.append("Title: " + title + "\r\n");
         user_info.append("Email: " + email + "\r\n");
         user_info.append("Instrument Type: " + instrument + "\r\n");
         user_info.append("\r\n");
         user_info.append("https://prix.hanyang.ac.kr/admin/requestlog.jsp");
         MimeMultipart mp = new MimeMultipart();
         MimeBodyPart text = new MimeBodyPart();
         text.setText(user_info.toString());
         mp.addBodyPart(text);
         msg.setContent(mp);
         Transport.send(msg);
      } catch (Exception var14) {
         System.out.println("ERRR in sendMailToMe");
         var14.printStackTrace();
      }

   }
}
