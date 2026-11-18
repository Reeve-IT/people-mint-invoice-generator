const $ = (id) => document.getElementById(id);
const money = (n) => new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", minimumFractionDigits:2 }).format(Number(n || 0));
const dateValue = (v) => v ? new Date(v + "T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const fields = ["invoiceNumber","invoiceDate","dueDate","placeOfSupply","clientName","clientAddress","clientContact","clientContactDetails","clientGstin","serviceDescription","candidateName","candidatePosition","annualSalary","joiningDate","notes","serviceAmount","otherCharges","amountWords"];

function init(){
  const today = new Date();
  const iso = (d)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  $("invoiceDate").value = iso(today);
  const due = new Date(today); due.setDate(due.getDate()+30); $("dueDate").value = iso(due);
  $("invoiceNumber").value = `PM-${today.getFullYear()}-001`;
  $("otherCharges").value = "0";
  $("previewCompanyName").textContent = COMPANY_CONFIG.name || "People-Mint";
  $("previewFooterCompany").textContent = COMPANY_CONFIG.name || "People-Mint";
  $("previewSignatory").textContent = COMPANY_CONFIG.signatory || "Authorised Signatory";
  const contact = [COMPANY_CONFIG.address, COMPANY_CONFIG.phone, COMPANY_CONFIG.email, COMPANY_CONFIG.pan ? `PAN: ${COMPANY_CONFIG.pan}` : "", COMPANY_CONFIG.gstin ? `Company GSTIN: ${COMPANY_CONFIG.gstin}` : "", COMPANY_CONFIG.msme ? `MSME: ${COMPANY_CONFIG.msme}` : ""].filter(Boolean).join("\n");
  $("companyContactPreview").textContent = contact;
  $("previewBankDetails").textContent = COMPANY_CONFIG.bankDetails || "Please contact the company for payment details.";
  if(COMPANY_CONFIG.logoPath) $("logoArea").innerHTML = `<img src="${COMPANY_CONFIG.logoPath}" alt="People-Mint HR Consulting Services logo">`;
  fields.forEach(id => $(id).addEventListener("input", updatePreview));
  updatePreview(); renderHistory();
}
function getData(){ const data={}; fields.forEach(id=>data[id]=$(id).value); return data; }
function updatePreview(){
  const d=getData();
  $("previewInvoiceNumber").textContent=d.invoiceNumber||"—";
  $("previewInvoiceDate").textContent=dateValue(d.invoiceDate);
  $("previewDueDate").textContent=dateValue(d.dueDate);
  $("previewPlace").textContent=d.placeOfSupply||"—";
  $("previewClientName").textContent=d.clientName||"Client / company name";
  $("previewClientAddress").textContent=d.clientAddress||"Billing address";
  $("previewClientContact").textContent=[d.clientContact,d.clientContactDetails].filter(Boolean).join(" • ");
  $("previewClientGstin").textContent=d.clientGstin?`Client GSTIN: ${d.clientGstin}`:"";
  $("previewClientGstin").style.display=d.clientGstin?"block":"none";
  $("previewService").textContent=d.serviceDescription||"Service description";
  $("previewServiceAmount").textContent=Number(d.serviceAmount||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
  $("previewOtherCharges").textContent=Number(d.otherCharges||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
  const candidate=[d.candidateName?`Candidate: ${d.candidateName}`:"",d.candidatePosition?`Position: ${d.candidatePosition}`:"",d.annualSalary?`Annual remuneration: ${money(d.annualSalary)}`:"",d.joiningDate?`Joining date: ${dateValue(d.joiningDate)}`:""].filter(Boolean).join("  |  ");
  $("previewCandidate").textContent=candidate;
  const subtotal=Number(d.serviceAmount||0)+Number(d.otherCharges||0);
  $("previewSubtotal").textContent=money(subtotal);
  $("previewTotal").textContent=money(subtotal);
  $("previewAmountWords").textContent=d.amountWords||"";
  $("previewNotes").textContent=d.notes||"";
  $("previewNotesBlock").style.display=d.notes?"block":"none";
  $("otherRow").style.display=Number(d.otherCharges||0)>0?"table-row":"none";
}
function validate(){
  const required=[["invoiceNumber","Enter an invoice number."],["invoiceDate","Select an invoice date."],["clientName","Enter the client name."],["serviceDescription","Enter a service description."],["serviceAmount","Enter the service amount."]];
  for(const [id,msg] of required){if(!$(id).value.trim()){alert(msg);$(id).focus();return false;}}
  if(Number($("serviceAmount").value)<0||Number($("otherCharges").value)<0){alert("Amounts cannot be negative.");return false;}
  return true;
}
function saveInvoice(){
  if(!validate())return;
  const d=getData(); const history=JSON.parse(localStorage.getItem("pmInvoices")||"[]");
  const item={...d,id:d.invoiceNumber,updatedAt:new Date().toISOString()};
  const index=history.findIndex(x=>x.id===item.id);
  if(index>=0)history[index]=item;else history.unshift(item);
  localStorage.setItem("pmInvoices",JSON.stringify(history.slice(0,50)));
  renderHistory(); alert("Invoice saved in this browser.");
}
function renderHistory(){
  const history=JSON.parse(localStorage.getItem("pmInvoices")||"[]");
  const box=$("historyList");
  if(!history.length){box.innerHTML='<p class="empty-state">No saved invoices yet.</p>';return;}
  box.innerHTML=history.map((x,i)=>`<div class="history-item"><div><strong>${escapeHtml(x.invoiceNumber)}</strong><small>${escapeHtml(x.clientName||"")} · ${money(Number(x.serviceAmount||0)+Number(x.otherCharges||0))}</small></div><div class="history-actions"><button class="mini-button" data-load="${i}">Open</button><button class="mini-button" data-delete="${i}">Delete</button></div></div>`).join("");
  box.querySelectorAll("[data-load]").forEach(b=>b.addEventListener("click",()=>{const item=history[Number(b.dataset.load)];fields.forEach(id=>$(id).value=item[id]||"");updatePreview();window.scrollTo({top:0,behavior:"smooth"});}));
  box.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>{if(confirm("Delete this saved invoice?")){history.splice(Number(b.dataset.delete),1);localStorage.setItem("pmInvoices",JSON.stringify(history));renderHistory();}}));
}
function escapeHtml(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("previewBtn").addEventListener("click",()=>{updatePreview();$("invoicePreview").scrollIntoView({behavior:"smooth",block:"start"});});
$("saveBtn").addEventListener("click",saveInvoice);
$("downloadBtn").addEventListener("click",()=>{if(!validate())return;updatePreview();window.print();});
$("newInvoiceBtn").addEventListener("click",()=>{if(!confirm("Start a new invoice? Unsaved changes will be cleared."))return;$("invoiceForm").reset();const d=new Date();$("invoiceDate").value=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;$("invoiceNumber").value=`PM-${d.getFullYear()}-${String(Date.now()).slice(-4)}`;$("otherCharges").value="0";updatePreview();window.scrollTo({top:0,behavior:"smooth"});});
init();
