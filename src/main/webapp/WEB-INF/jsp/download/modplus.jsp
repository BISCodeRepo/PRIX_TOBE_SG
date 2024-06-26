<jsp:include page="../inc/download.jsp" flush="true" />
<!-- header ��-->

<table width="1090" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td width="190" height="100%" rowspan="2" align="right" valign="top" style="padding-right:15px">
		<!-- left menu -->
	<jsp:include page="../inc/download_menu.jsp" flush="true" />
	</td>
    <td height="10" valign="top">
	
		<table border="0" cellspacing="0" cellpadding="0" id="TitTable">
		  <tr>
			<td align="left"><font class="drakBR" size="3">MODplus</font> - Robust and Unrestrictive Identification of Post-Translational Modifications Using Mass Spectrometry</td>
            <td align="right" valign="bottom" style="padding-right:5px;"><table border="0" cellspacing="0" cellpadding="0">
<%
	if( session.getAttribute("id") != null && !session.getAttribute("id").equals("4") )
	{
%>
          <tr>
            <td><img src="/images/top_icon_01.gif" width="2" height="9"> &nbsp;<a href="/modplus/history.jsp" class="menu">History</a> &nbsp; &nbsp;</td>
            <td><img src="/images/top_icon_01.gif" width="2" height="9"> &nbsp;<a href="/login.jsp?action=logout" class="menu">Logout</a> &nbsp; &nbsp;</td>
          </tr>
<%
	}
%>
        </table></td>
      </tr>
    </table>
	<table width="650" border="0" align="left" cellpadding="1">
			<tr>
			  <td width="600" align="left">Post-translational modifications regulate various cellular processes and are of great biological interest. Unrestrictive searches of mass spectrometry data enable the detection of any type of modification. MODplus makes practical unrestrictive searches possible by allowing (1) hundreds of modifications, (2) multiple modifications per peptide, (3) the whole proteome database, and (4) any tolerant values in search parameters. </td>
			</tr>
			<tr>
			  <td align="left">&nbsp;</td>
			</tr>

			<tr>
			  <td class="grayTD" align="left"><img src="/images/p_st1.GIF" width="4" height="9"><font class="drakBR"> Software</font><br/></td>
			</tr>
			<tr>			
				
				<td align="left"><ul>
					<li>Requirement</li><br><font class="blue"> 
					MODplus was implemented using JAVA programming language, and requires Java Running Environment (JRE).<br> 
					If JRE is not installed, please visit <a href="http://www.oracle.com/technetwork/java/index.html" target="_blank" class="under">http://www.oracle.com/technetwork/java/index.html</a><br><br></font>

					<li>Release Note</li><br>
					- <font class="blue"><a href="MODplus_ReleaseNote.txt" class="under">Jan 15, 2023: version 2.01</font> ( <a href="/request?software=MODplus" class="under">Software download</a> )<br>
					- <font class="blue">Jan 18, 2021: version 1.02</font> <br>
					- <font class="blue">Sep 29, 2020: version 1.01</font> <br>
			   </ul></td>
			<tr>
			  <td class="grayTD" align="left"><img src="/images/p_st1.GIF" width="4" height="9"><font class="drakBR"> Publication</font><br/></td>
			</tr>
			<tr>
			  <td>&nbsp;&nbsp;&nbsp;<font class="drakBR">MODplus: Robust and Unrestrictive Identification of Post-Translational Modifications 
			  <br>&nbsp;&nbsp;&nbsp;Using Mass Spectrometry </font><br>&nbsp;&nbsp;&nbsp;<em>Seungjin Na, Jihyung Kim and Eunok Paek.</em><br>&nbsp;&nbsp;&nbsp;Analytical Chemistry, 2019, 91, 17, 11324-11333. <a href="https://pubmed.ncbi.nlm.nih.gov/31365238/" target="_blank" class="under">[ PMID: 31365238 ]</a></td>
			</tr>	
			<tr>
			</tr>

		</table>	
	</td>
  </tr>
</table>

<jsp:include page="../inc/footer.jsp" flush="true" />
