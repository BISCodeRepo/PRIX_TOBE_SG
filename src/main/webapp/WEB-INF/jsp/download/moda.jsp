<jsp:include page="/inc/download.jsp" flush="true" />
<!-- header ��-->
<meta http-equiv="refresh" content="5; url=modplus.jsp">


<table width="1090" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td width="190" height="100%" rowspan="2" align="right" valign="top" style="padding-right:15px">
		<!-- left menu -->
	<jsp:include page="/inc/download_menu.jsp" flush="true" />
	</td>
    <td height="10" valign="top">
	
		<table border="0" cellspacing="0" cellpadding="0" id="TitTable">
			<tr>
				<td align="left"><font class="red" size="2">This service is currently stopped.</td>
			</tr>
			<tr>
				<td align="left"><font class="red" size="2">Please use MODplus instead. Automatically moving to modplus download page after 5 seconds. </td>
			</tr>
		
		  <tr>
			<td align="left"><font class="drakBR" size="3">MODa</font> - Multi-blind modification search</td>
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
			  <td width="600" align="left">With great biological interest in post-translational modifications (PTMs), various approaches have been introduced to identify PTMs using MS/MS. MODa is a novel "multi-blind" spectral alignment algorithm that allows for fast unrestrictive PTM searches with no limitation on the number of modifications per peptide while featuring over an order of magnitude speedup in relation to existing approaches.</td>
			</tr>
			<tr>
			  <td align="left">&nbsp;</td>
			</tr>

			<tr>
			  <td class="grayTD" align="left"><img src="/images/p_st1.GIF" width="4" height="9"><font class="drakBR"> Software</font><br/></td>
			</tr>
			<tr>			
				<!--td align="left">
				&nbsp;&nbsp;- <font class="blue">Oct 01, 2012: version 1.02</font> ( <a href="/request.jsp?software=MODa" class="under">Software download</a> )<br>
				&nbsp;&nbsp;- Mar 01, 2012: version 1.01 <br><br>
				</td-->
				<td align="left"><ul>
					<li>Requirement</li><br><font class="blue"> 
					MODa was implemented using JAVA programming language, and requires Java Running Environment (JRE).<br> 
					If JRE is not installed, please visit <a href="http://www.oracle.com/technetwork/java/index.html" target="_blank" class="under">http://www.oracle.com/technetwork/java/index.html</a><br><br></font>

					<li>Release Note</li><br>
					
					- Jun 12, 2019: version 1.62<br>
					<!--
					- <font class="blue"><a href="ReleaseNote.txt" class="under">Jun 12, 2019: version 1.62</font> ( <a href="/request.jsp?software=MODa" class="under">Software download</a> )<br>
					-->
					- Jun 15, 2018: version 1.61<br>
					- Mar 9, 2018: version 1.60<br>
					- Feb 15, 2016: version 1.51<br>
					- Jan 22, 2016: version 1.50<br>
					- May 28, 2014: version 1.23<br>
					- May 9, 2014: version 1.22<br>
					- March 27, 2014: version 1.21<br>
					- March 03, 2014: version 1.20<br>

			   </ul></td>
			<tr>
			  <td class="grayTD" align="left"><img src="/images/p_st1.GIF" width="4" height="9"><font class="drakBR"> Publication</font><br/></td>
			</tr>
			<tr>
			  <td>&nbsp;&nbsp;&nbsp;<font class="drakBR">Fast multi-blind modification search through tandem mass spectrometry.</font><br>&nbsp;&nbsp;&nbsp;<em>Seungjin Na, Nuno Bandeira, and Eunok Paek.</em><br>&nbsp;&nbsp;&nbsp;Molecular and Cellular Proteomics, 2012, 11, M111.010199. <a href="http://www.ncbi.nlm.nih.gov/pubmed/22186716" target="_blank" class="under">[ PMID: 22186716 ]</a></td>
			</tr>	
			<tr>
				<td><a href="https://omictools.com/modification-via-alignment-tool"><img src="/images/omictoolslogo.JPG" width="120px" height="40px"></a></td>
			</tr>

		</table>	
	</td>
  </tr>
</table>

<jsp:include page="/inc/footer.jsp" flush="true" />
