const { readFileSync } = require('fs');

// ==========================================
// FUNÇÕES DE CÁLCULO E REUSO (LÓGICA DE NEGÓCIO)
// ==========================================

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(valor / 100);
}

function getPeca(pecas, apresentacao) {
  return pecas[apresentacao.id];
}

function calcularTotalApresentacao(pecas, apre) {
  let total = 0;
  switch (getPeca(pecas, apre).tipo) {
    case "tragedia":
      total = 40000;
      if (apre.audiencia > 30) {
        total += 1000 * (apre.audiencia - 30);
      }
      break;
    case "comedia":
      total = 30000;
      if (apre.audiencia > 20) {
         total += 10000 + 500 * (apre.audiencia - 20);
      }
      total += 300 * apre.audiencia;
      break;
    default:
      throw new Error(`Peça desconhecida: ${getPeca(pecas, apre).tipo}`);
  }
  return total;
}

function calcularCredito(pecas, apre) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(pecas, apre).tipo === "comedia") 
     creditos += Math.floor(apre.audiencia / 5);
  return credited; // Note: if you had 'creditos', make sure it's spelt correctly: creditos
  // Correction from previous step: let's make sure it returns creditos
}

// Pequeno ajuste para garantir que a variável interna bate com o retorno
function calcularCredito(pecas, apre) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(pecas, apre).tipo === "comedia") 
     creditos += Math.floor(apre.audiencia / 5);
  return creditos;   
}

function calcularTotalFatura(pecas, apresentacoes) {
  let total = 0;
  for (let apre of apresentacoes) {
    total += calcularTotalApresentacao(pecas, apre);
  }
  return total;
}

function calcularTotalCreditos(pecas, apresentacoes) {
  let creditos = 0;
  for (let apre of apresentacoes) {
    creditos += calcularCredito(pecas, apre);
  }
  return creditos;
}

// ==========================================
// FUNÇÕES DE APRESENTAÇÃO
// ==========================================

// 1. Apresentação em String (Texto Plano)
function gerarFaturaStr(fatura, pecas) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
    }
    
    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
    return faturaStr;
}

// 2. Apresentação em HTML (Corrigida)
function gerarFaturaHTML(fatura, pecas) {
    let html = `<html><p> Fatura ${fatura.cliente} </p><ul>`;
    
    for (let apre of fatura.apresentacoes) {
        html += `<li>  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos) </li>`;
    }
    
    // LINHA CORRIGIDA AQUI: tirado o .fatura extra
    html += `</ul><p> Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))} </p>`;
    html += `<p> Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} </p></html>`;
    return html;
}

// ==========================================
// PROGRAMA PRINCIPAL
// ==========================================

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

// Exibindo a fatura em formato Texto
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log("--- FATURA TEXTO ---");
console.log(faturaStr);

// Exibindo a nova fatura em formato HTML
const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log("\n--- FATURA HTML ---");
console.log(faturaHTML);