package com.prix.homepage.user.service;

import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;

public class PrixConnector {
	public static Connection getConnection() {
		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();
		//	Connection conn = DriverManager.getConnection("jdbc:mysql://172.16.63.108/prix?user=root&password=islab");
			Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/prix?user=root&password=prix3306");
			return conn;
		} catch (Exception e) {
			return null;
		}
	}

	public static void main(String args[]) {
		try {
			Connection conn = PrixConnector.getConnection();
			if (conn == null)
				return;
			Statement state = conn.createStatement();
			ResultSet rs = state.executeQuery("select id, type, name from px_data;");
			while (rs.next())
			{
				System.out.println("[" + rs.getString(2) + "] " + rs.getString(3));
			}
			rs.close();
			state.close();
			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
