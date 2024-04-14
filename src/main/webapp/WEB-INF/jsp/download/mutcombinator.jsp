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
			<td align="left"><font class="drakBR" size="3">MutCombinator</font> - Combinatorial mutation search</td>
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
			  <td width="600" align="left">MutCombinator enables us to practically identify mutated peptides from tandem mass spectra allowing combinatorial mutations during the database search. It uses an upgraded version of a variant graph, keeping track of frame information. The variant graph is indexed by nine nucleotides for fast access. Combinations of point mutations are considered, and also it can be practically applied together with a large mutation database such as COSMIC. Furthermore, MutCombinator supports in-frame search for coding regions and three-frame search for noncoding regions.</td>
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
					MutCombinator was implemented using JAVA programming language, and requires Java Running Environment (JRE).<br> 
					If JRE is not installed, please visit <a href="http://www.oracle.com/technetwork/java/index.html" target="_blank" class="under">http://www.oracle.com/technetwork/java/index.html</a><br><br></font>

					<li>Release Note</li><br>
					- <font class="blue"><a href="MutCombinator_ReleaseNote.txt" class="under">Mar 26, 2020: version 1.11</font> ( <a href="/request.jsp?software=MutCombinator" class="under">Software download</a> )<br>
					- <font class="blue">Jan 22, 2020: version 1.10</font><br><br>
			   </ul></td>
			<tr>
			  <td class="grayTD" align="left"><img src="/images/p_st1.GIF" width="4" height="9"><font class="drakBR"> Publication</font><br/></td>
			</tr>
			<tr>
			  <td>&nbsp;&nbsp;&nbsp;<font class="drakBR">MutCombinator: identification of mutated peptides allowing combinatorial mutations using nucleotide-based <br>&nbsp;&nbsp;&nbsp;graph search.</font><br>&nbsp;&nbsp;&nbsp;<em>Seunghyuk Choi and Eunok Paek.</em><br>&nbsp;&nbsp;&nbsp;Bioinformatics, 2020, 7, i203-i209. <a href="https://pubmed.ncbi.nlm.nih.gov/32657416/" target="_blank" class="under">[ PMID: 32657416 ]</a></td>
			</tr>	
			<tr>
			</tr>

		</table>	
	</td>
  </tr>
</table>

<jsp:include page="/inc/footer.jsp" flush="true" />
