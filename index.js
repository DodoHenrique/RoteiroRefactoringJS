const { readFileSync } = require('fs');

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

class ServicoCalculoFatura {

  calcularTotalApresentacao(pecas, apre) {
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

  calcularCredito(pecas, apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(pecas, apre).tipo === "comedia") 
       creditos += Math.floor(apre.audiencia / 5);
    return creditos;   
  }

  calcularTotalFatura(pecas, apresentacoes) {
    let total = 0;
    for (let apre of apresentacoes) {
      // Chamada interna usando 'this'
      total += this.calcularTotalApresentacao(pecas, apre);
    }
    return total;
  }

  calcularTotalCreditos(pecas, apresentacoes) {
    let creditos = 0;
    for (let apre of apresentacoes) {
      // Chamada interna usando 'this'
      creditos += this.calcularCredito(pecas, apre);
    }
    return creditos;
  }
}


function gerarFaturaStr(fatura, pecas, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    
    for (let apre of fatura.apresentacoes) {
        // Chamadas usando o objeto 'calc' como alvo
        faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
    }
    
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
    return faturaStr;
}

/* // Função comentada conforme solicitado
function gerarFaturaHTML(fatura, pecas) {
    let html = `<html><p> Fatura ${fatura.cliente} </p><ul>`;
    for (let apre of fatura.apresentacoes) {
        html += `<li>  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos) </li>`;
    }
    html += `</ul><p> Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))} </p>`;
    html += `<p> Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} </p></html>`;
    return html;
}
*/

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));


const calc = new ServicoCalculoFatura();


const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log("--- FATURA TEXTO ---");
console.log(faturaStr);

/*
// Chamada HTML comentada conforme solicitado
const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log("\n--- FATURA HTML ---");
console.log(faturaHTML);
*/