<jsp:include page="/inc/download.jsp" flush="true" />
<!-- header ��-->

<table width="1090" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td width="190" height="100%" rowspan="2" align="right" valign="top" style="padding-right:15px">
		<!-- left menu -->
	<jsp:include page="/inc/download_menu.jsp" flush="true" />
	</td>
    <td height="10" valign="top">
	
		<table border="0" cellspacing="0" cellpadding="0" id="TitTable">
		  <tr>
			<td align="left"><font class="drakBR" size="3">deMix</font> - Decoding deuterated Distributions from heterogeneous protein states via HDX-MS</td>
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
			  <td width="600" align="left">deMix deals directly with the deuterated isotopic distributions, but not considering their centroid masses and is designed to be robust over random noises. In addition, unlike the existing approaches that can only determine a single state from an isotopic distribution, deMix can also detect a bimodal deuterated distribution, arising from EX1 behavior or heterogeneous peptides in conformational isomer proteins. Furthermore, deMix comes with visualization software to facilitate validation and representation of the analysis results.</td>
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
					deMix was implemented using JAVA programming language, and requires Java Running Environment (JRE).<br> 
					If JRE is not installed, please visit <a href="http://www.oracle.com/technetwork/java/index.html" target="_blank" class="under">http://www.oracle.com/technetwork/java/index.html</a><br><br></font>

					<li>Release Note</li><br>
					- <font class="blue"><a href="deMix_ReleaseNote.txt" class="under">Apr 7, 2019: version 1.01</font> ( <a href="/request.jsp?software=demix" class="under">Software download</a> )<br>

			   </ul></td>
			<tr>
			  <td class="grayTD" align="left"><img src="/images/p_st1.GIF" width="4" height="9"><font class="drakBR"> Publication</font><br/></td>
			</tr>
			<tr>
			  <td>&nbsp;&nbsp;&nbsp;<font class="drakBR">deMix: Decoding Deuterated Distributions from Heterogeneous Protein States via HDX-MS.</font><br>&nbsp;&nbsp;&nbsp;<em>Seungjin Na, Jae-Jin Lee, Jong Wha J. Joo, Kong-Joo Lee and Eunok Paek.</em><br>&nbsp;&nbsp;&nbsp;Scientific Reports, 2019, 9(1):3176. <a href="https://www.ncbi.nlm.nih.gov/pubmed/30816214" target="_blank" class="under">[ PMID: 30816214 ]</a></td>
			</tr>	
		</table>	
	</td>
  </tr>
</table>

<jsp:include page="/inc/footer.jsp" flush="true" />
