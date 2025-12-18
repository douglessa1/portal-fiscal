import { parseStringPromise } from 'xml2js'
export async function parseNFe(xmlText) {
    const xmlObj = await parseStringPromise(xmlText, { explicitArray: true, mergeAttrs: true })
    const infNFe = xmlObj?.nfeProc?.NFe?.[0]?.infNFe?.[0] || xmlObj?.NFe?.[0]?.infNFe?.[0] || xmlObj?.infNFe?.[0] || null
    if (!infNFe) throw new Error('infNFe not found')
    const chave = infNFe?.['$']?.Id ? infNFe['$'].Id.replace(/^NFe/i, '') : null
    const emitCNPJ = infNFe?.emit?.[0]?.CNPJ?.[0] || null
    const destCNPJ = infNFe?.dest?.[0]?.CNPJ?.[0] || infNFe?.dest?.[0]?.CPF?.[0] || null
    const total = infNFe?.total?.[0]?.ICMSTot?.[0]?.vNF?.[0] || infNFe?.total?.[0]?.vNF?.[0] || null
    const itensCount = infNFe?.det?.length || 0
    return { chave, emitCNPJ, destCNPJ, valorTotal: total ? parseFloat(total) : null, itensCount }
}
