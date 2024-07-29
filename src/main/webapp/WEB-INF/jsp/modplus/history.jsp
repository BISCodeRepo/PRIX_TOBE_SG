<jsp:include page="/inc/livesearch.jsp" flush="true" />
<!-- header end-->

<%@ page import="javax.naming.Context" %>
<%@ page import="javax.naming.InitialContext" %>
<%@ page import="javax.sql.DataSource" %>
<%@ page import="java.sql.Connection" %>
<%@ page import="java.sql.Statement" %>
<%@ page import="java.sql.ResultSet" %>

<%
	response.setCharacterEncoding("UTF-8");
	
	String id = (String)session.getAttribute("id");
	if (id == null)
		response.sendRedirect("../login.jsp?url=modplus/history.jsp");

	Context initContext = new InitialContext();
	Context envContext = (Context)initContext.lookup("java:/comp/env");
	DataSource ds = (DataSource)envContext.lookup("jdbc/PrixDB");
	Connection conn = ds.getConnection();

	boolean hasUnfinishedJob = false;
	Statement jobState = conn.createStatement();
	ResultSet jobRS = null;
	if (conn != null) {
		String jonQ = "select job_code, title from px_job_queue where user_id=" + id + " order by id desc;";
		try {
			jobRS = jobState.executeQuery(jonQ);
		} catch (Exception e) {
			jobRS = jobState.executeQuery(jonQ);
		}
		if( jobRS.next() ) hasUnfinishedJob = true;
		else {
			jobRS.close();
			jobState.close();
		}
	}

%>

<table width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td width="190" height="100%" rowspan="2" align="right" valign="top" style="padding-right:15px">
	<!-- left menu -->
	<jsp:include page="/inc/livesearch_menu.jsp" flush="true" />
	</td>
    <td height="10" valign="top"><table border="0" cellspacing="0" cellpadding="0" id="TitTable">
      <tr>
        <td style="padding-left:15px;"><font class="drakBR" size="3">History</font> - MS/MS search</td>
        <td align="right" valign="bottom" style="padding-right:5px;"><table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td><img src="/images/top_icon_01.gif" width="2" height="9"> &nbsp;<a href="history.jsp" class="menu">History</a> &nbsp; &nbsp;</td>
            <td><img src="/images/top_icon_01.gif" width="2" height="9"> &nbsp;<a href="/login.jsp" class="menu">Logout</a> &nbsp; &nbsp;</td>
			<td width="30">&nbsp;&nbsp;</td>
          </tr>
        </table></td>
      </tr>
    </table>
      </td>
  </tr>
  <tr>
    <td>
	<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="BORDER-BOTTOM: #d9dddc 1px solid; BORDER-TOP: #d9dddc 2px solid; ">
	

	<!-- UNfinished Jobs:-->
	<% if( hasUnfinishedJob ) { %>
		<tr>    
		  <td class="grayTH" colspan="6"><div align="left">You have <font color="red"><b>RUNNING or recently FINISHED </b></font> jobs. Click the job links to see the progress or results.</div></td>     
		</tr>
		<% do { %>
			<tr>  
				<td class="grayTD" colspan="6"><div align="left">
				<a href="/modplus/result.jsp?file=<%=jobRS.getString(1)%>" target="_blank"><%=jobRS.getString(1)%></a>&nbsp;&nbsp;Job titled '<%=jobRS.getString(2)%>'</div></td>
			</tr>
			<%
			} while (jobRS.next());
			jobRS.close();
			jobState.close();
		}
		%>
	<% if( hasUnfinishedJob ) { %> 
		<tr><td class="grayTD" colspan="6">&nbsp;</td></tr>
		<tr><td class="grayTH" colspan="6"><font color="red"><b>CONFIRMED</b></font> search results</td></tr>
	<% } %>


    <tr>    
      <td class="grayTH"><div align="center">Index</div></td>
      <td class="grayTH"><div align="center">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>
      <td class="grayTH"><div align="center">Title</div></td>
      <td class="grayTH"><div align="center">MS/MS data</div></td>
	  <td class="grayTH"><div align="center">Database</div></td>
	  <td class="grayTH"><div align="center">Engine</div></td>
    </tr>
<%
	if (conn != null)
	{
		int index = 0;
		Statement state = conn.createStatement();
		String sql = "select title, date, msfile, db, result, engine from px_search_log where user_id=" + id + " order by date desc, id desc;";
		ResultSet rs = null;
		try {
			rs = state.executeQuery(sql);
		} catch (Exception e) {
			rs = state.executeQuery(sql);
		}
		while (rs.next())
		{
			String msFile = "";
			String dbFile = "";
			Statement stateForName = conn.createStatement();
			ResultSet rsForName = stateForName.executeQuery("select name from px_data where id=" + rs.getInt(3) + ";");
			if (rsForName.next())
				msFile = rsForName.getString(1);
			rsForName.close();
			rsForName = stateForName.executeQuery("select name from px_data where id=" + rs.getInt(4) + ";");
			if (rsForName.next())
				dbFile = rsForName.getString(1);
			rsForName.close();
			stateForName.close();
%>
	<tr>
	  <td class="grayTD"><div align="center"><a href="result.jsp?file=<%=rs.getInt(5)%>"><%=++index%><a/></div></td>
      <td class="grayTD"><div align="center"><%=rs.getString(2)%></div></td>
      <td class="grayTD"><div align="center"><%=rs.getString(1)%></div></td>
	  <td class="grayTD"><div align="center"><%=msFile%></div></td>
      <td class="grayTD"><div align="center"><%=dbFile%></div></td>
      <td class="grayTD"><div align="center"><%=rs.getString(6)%></div></td>
	</tr> 
<%
		if( index == 50 ) break;
		}
		rs.close();
		state.close();
		conn.close();
	}
%>
	<!--tr>
	  <td class="grayTD"><div align="center"><a href="/">1<a/></div></td>
      <td class="grayTD"><div align="center">2009-12-15</div></td>
      <td class="grayTD"><div align="center">Lens</div></td>
	  <td class="grayTD"><div align="center">lens.mgf</div></td>
      <td class="grayTD"><div align="center">swissprot</div></td>
	</tr> 
	<tr>
	  <td class="grayTD"><div align="center"><a href="/">2<a/></div></td>
      <td class="grayTD"><div align="center">2009-12-17</div></td>
      <td class="grayTD"><div align="center">Test</div></td>
	  <td class="grayTD"><div align="center">xxx.mgf</div></td>
      <td class="grayTD"><div align="center">xxx.fasta</div></td>
	</tr--> 
</table></td>
  </tr>
</table>

<jsp:include page="/inc/footer.jsp" flush="true" />
