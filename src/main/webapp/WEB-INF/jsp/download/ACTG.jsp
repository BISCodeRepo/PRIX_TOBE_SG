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
			<td align="left"><font class="drakBR" size="3">ACTG</font> - Novel peptide mapping</td>
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
			  <td width="600" align="left">In many proteogenomics applications, mapping peptide sequences onto gene models can be very useful because it can find new gene model ,and correct or modify annotated gene model. ACTG provides a peptide mapping allowing four structural variations: junction variation, exon skipping, frame shift and intron retention (exon extension at exon-exon junction).</td>
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
					ACTG was implemented using JAVA programming language, and requires Java Running Environment (JRE).<br> 
					If JRE is not installed, please visit <a href="http://www.oracle.com/technetwork/java/index.html" target="_blank" class="under">http://www.oracle.com/technetwork/java/index.html</a><br><br></font>

					<li>Release Note</li><br>
					- <font class="blue"><a href="ACTG_ReleaseNote.txt" class="under">Nov 17, 2020: version 1.20</font> ( <a href="/request.jsp?software=ACTG" class="under">Software download</a> )<br>
					- Nov 5, 2018: version 1.11<br>
					<!--- Dec 19, 2016: version 1.10<br>-->

			   </ul></td>
			<tr>
			  <td class="grayTD" align="left"><img src="/images/p_st1.GIF" width="4" height="9"><font class="drakBR"> Publication</font><br/></td>
			</tr>
			<tr>
			  <td>&nbsp;&nbsp;&nbsp;<font class="drakBR">ACTG: novel peptide mapping onto gene models</font><br>&nbsp;&nbsp;&nbsp;<em>Seunghyuk Choi, Hyunwoo Kim, and Eunok Paek.</em><br>&nbsp;&nbsp;&nbsp;Bioinformatics, 2017, 33(8), 1218-1220. <a href="https://www.ncbi.nlm.nih.gov/pubmed/28031186" target="_blank" class="under">[ PMID: 28031186 ]</a></td>
			</tr>	
			<tr>
				<td><a href="https://omictools.com/amino-acids-to-genome-tool"><img src="/images/omictoolslogo.JPG" width="120px" height="40px"></a></td>
			</tr>

		</table>	
	</td>
  </tr>
</table>

<jsp:include page="/inc/footer.jsp" flush="true" />
