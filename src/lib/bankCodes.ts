/**
 * This file contains a list of Nigerian banks with their bank codes,
 * along with a set of aliases for each bank.
 *
 * Data compiled using existing sources such as the CBN published bank code list,
 * financial institution websites, and financial listings updated through 2024.
 */

export const banks = [
  { BANK_NAME: "Kuda MFB", BANK_CODE: "090267" },
  { BANK_NAME: "9 Payment Service Bank", BANK_CODE: "000802" },
  { BANK_NAME: "Access Bank", BANK_CODE: "000014" },
  { BANK_NAME: "Access Bank Plc (Diamond Bank)", BANK_CODE: "000005" },
  { BANK_NAME: "Accion MFB", BANK_CODE: "090134" },
  { BANK_NAME: "Baines Credit MFB", BANK_CODE: "090188" },
  { BANK_NAME: "Bowen MFB", BANK_CODE: "090148" },
  { BANK_NAME: "Carbon", BANK_CODE: "100026" },
  { BANK_NAME: "Cellulant", BANK_CODE: "100005" },
  { BANK_NAME: "Citi Bank", BANK_CODE: "000009" },
  { BANK_NAME: "Contec Global", BANK_CODE: "100032" },
  { BANK_NAME: "CoreStep MFB", BANK_CODE: "090365" },
  { BANK_NAME: "Coronation Merchant Bank", BANK_CODE: "060001" },
  { BANK_NAME: "e-BARCS MFB", BANK_CODE: "090156" },
  { BANK_NAME: "Ecobank Nigeria", BANK_CODE: "000010" },
  { BANK_NAME: "Ecobank Xpress Account", BANK_CODE: "100008" },
  { BANK_NAME: "Ekondo MFB", BANK_CODE: "090097" },
  { BANK_NAME: "EYOWO", BANK_CODE: "090328" },
  { BANK_NAME: "FCMB", BANK_CODE: "000003" },
  { BANK_NAME: "FFS MFB", BANK_CODE: "090153" },
  { BANK_NAME: "Fidelity Bank", BANK_CODE: "000007" },
  { BANK_NAME: "First Bank of Nigeria", BANK_CODE: "000016" },
  { BANK_NAME: "FSDH Merchant Bank", BANK_CODE: "400001" },
  { BANK_NAME: "Globus Bank", BANK_CODE: "000027" },
  { BANK_NAME: "GoMoney", BANK_CODE: "100022" },
  { BANK_NAME: "GTBank (Guaranty Trust Bank)", BANK_CODE: "000013" },
  { BANK_NAME: "Heritage Bank", BANK_CODE: "000020" },
  { BANK_NAME: "JAIZ Bank", BANK_CODE: "000006" },
  { BANK_NAME: "JubileeLife Mortage Bank", BANK_CODE: "090003" },
  { BANK_NAME: "KCMB MFB", BANK_CODE: "090191" },
  { BANK_NAME: "Keystone Bank", BANK_CODE: "000002" },
  { BANK_NAME: "KrediMoney MFB", BANK_CODE: "090380" },
  { BANK_NAME: "Mainstreet MFB", BANK_CODE: "090171" },
  { BANK_NAME: "Mint-Finex MFB", BANK_CODE: "090281" },
  { BANK_NAME: "Opay Digital Services Limited", BANK_CODE: "100004" },
  { BANK_NAME: "Paga", BANK_CODE: "100002" },
  { BANK_NAME: "PalmPay", BANK_CODE: "100033" },
  { BANK_NAME: "Parkway-ReadyCash", BANK_CODE: "100003" },
  { BANK_NAME: "Parallex Bank", BANK_CODE: "000030" },
  { BANK_NAME: "PayAttitude Online", BANK_CODE: "110001" },
  { BANK_NAME: "Polaris Bank", BANK_CODE: "000008" },
  { BANK_NAME: "Providus Bank", BANK_CODE: "000023" },
  { BANK_NAME: "Rand Merchant Bank", BANK_CODE: "000024" },
  { BANK_NAME: "Rolez MFB", BANK_CODE: "090405" },
  { BANK_NAME: "Rubies", BANK_CODE: "090175" },
  { BANK_NAME: "Safe Haven MFB", BANK_CODE: "051113" },
  { BANK_NAME: "Sparkle MFB", BANK_CODE: "090325" },
  { BANK_NAME: "Stanbic IBTC Bank", BANK_CODE: "000012" },
  { BANK_NAME: "Stanbic Mobile Money", BANK_CODE: "100007" },
  { BANK_NAME: "Standard Chartered Bank", BANK_CODE: "000021" },
  { BANK_NAME: "Sterling Bank", BANK_CODE: "000001" },
  { BANK_NAME: "Suntrust Bank", BANK_CODE: "000022" },
  { BANK_NAME: "TAJ Bank", BANK_CODE: "000026" },
  { BANK_NAME: "Tangerine Money", BANK_CODE: "090426" },
  { BANK_NAME: "Titan Trust Bank", BANK_CODE: "000025" },
  { BANK_NAME: "Union Bank", BANK_CODE: "000018" },
  { BANK_NAME: "United Bank for Africa (UBA)", BANK_CODE: "000004" },
  { BANK_NAME: "Unity Bank", BANK_CODE: "000011" },
  { BANK_NAME: "VFD MFB", BANK_CODE: "090110" },
  { BANK_NAME: "Wema Bank", BANK_CODE: "000017" },
  { BANK_NAME: "Zenith Bank Plc", BANK_CODE: "000015" },
  { BANK_NAME: "Zinternet - KongaPay", BANK_CODE: "100025" },
];

export const bankAliases = {
  // Kuda MFB aliases
  kuda: { BANK_NAME: "Kuda MFB", BANK_CODE: "090267" },
  kudamfb: { BANK_NAME: "Kuda MFB", BANK_CODE: "090267" },
  kudabank: { BANK_NAME: "Kuda MFB", BANK_CODE: "090267" },

  // 9 Payment Service Bank aliases
  "9psb": { BANK_NAME: "9 Payment Service Bank", BANK_CODE: "000802" },
  "9paymentservice": {
    BANK_NAME: "9 Payment Service Bank",
    BANK_CODE: "000802",
  },
  "9bank": { BANK_NAME: "9 Payment Service Bank", BANK_CODE: "000802" },

  // Access Bank aliases
  access: { BANK_NAME: "Access Bank", BANK_CODE: "000014" },
  acces: { BANK_NAME: "Access Bank", BANK_CODE: "000014" },
  acess: { BANK_NAME: "Access Bank", BANK_CODE: "000014" },
  accessbank: { BANK_NAME: "Access Bank", BANK_CODE: "000014" },

  // Diamond Bank aliases (now integrated with Access Bank as per merger history)
  diamondbank: {
    BANK_NAME: "Access Bank Plc (Diamond Bank)",
    BANK_CODE: "000005",
  },
  accessdiamond: {
    BANK_NAME: "Access Bank Plc (Diamond Bank)",
    BANK_CODE: "000005",
  },
  accessbankplc: {
    BANK_NAME: "Access Bank Plc (Diamond Bank)",
    BANK_CODE: "000005",
  },

  // Accion MFB aliases
  accion: { BANK_NAME: "Accion MFB", BANK_CODE: "090134" },
  accionmfb: { BANK_NAME: "Accion MFB", BANK_CODE: "090134" },

  // Baines Credit MFB aliases
  baines: { BANK_NAME: "Baines Credit MFB", BANK_CODE: "090188" },
  bainescredit: { BANK_NAME: "Baines Credit MFB", BANK_CODE: "090188" },
  bainesmfb: { BANK_NAME: "Baines Credit MFB", BANK_CODE: "090188" },

  // Bowen MFB aliases
  bowen: { BANK_NAME: "Bowen MFB", BANK_CODE: "090148" },
  bowenmfb: { BANK_NAME: "Bowen MFB", BANK_CODE: "090148" },

  // Carbon aliases
  carbon: { BANK_NAME: "Carbon", BANK_CODE: "100026" },

  // Cellulant aliases
  cellulant: { BANK_NAME: "Cellulant", BANK_CODE: "100005" },

  // Citi Bank aliases
  citi: { BANK_NAME: "Citi Bank", BANK_CODE: "000009" },
  citibank: { BANK_NAME: "Citi Bank", BANK_CODE: "000009" },

  // Contec Global aliases
  contec: { BANK_NAME: "Contec Global", BANK_CODE: "100032" },
  contecglobal: { BANK_NAME: "Contec Global", BANK_CODE: "100032" },

  // CoreStep MFB aliases
  corestep: { BANK_NAME: "CoreStep MFB", BANK_CODE: "090365" },
  corestepmfb: { BANK_NAME: "CoreStep MFB", BANK_CODE: "090365" },

  // Coronation Merchant Bank aliases
  coronation: { BANK_NAME: "Coronation Merchant Bank", BANK_CODE: "060001" },
  coronationbank: {
    BANK_NAME: "Coronation Merchant Bank",
    BANK_CODE: "060001",
  },

  // e-BARCS MFB aliases
  ebarcs: { BANK_NAME: "e-BARCS MFB", BANK_CODE: "090156" },
  "e-barcs": { BANK_NAME: "e-BARCS MFB", BANK_CODE: "090156" },
  ebarcsmfb: { BANK_NAME: "e-BARCS MFB", BANK_CODE: "090156" },

  // Ecobank aliases
  ecobank: { BANK_NAME: "Ecobank Nigeria", BANK_CODE: "000010" },
  eco: { BANK_NAME: "Ecobank Nigeria", BANK_CODE: "000010" },

  // Ecobank Xpress Account aliases
  ecobankxpress: { BANK_NAME: "Ecobank Xpress Account", BANK_CODE: "100008" },
  ecoexpress: { BANK_NAME: "Ecobank Xpress Account", BANK_CODE: "100008" },

  // Ekondo MFB aliases
  ekondo: { BANK_NAME: "Ekondo MFB", BANK_CODE: "090097" },
  ekondomfb: { BANK_NAME: "Ekondo MFB", BANK_CODE: "090097" },

  // EYOWO aliases
  eyowo: { BANK_NAME: "EYOWO", BANK_CODE: "090328" },

  // FCMB aliases
  fcmb: { BANK_NAME: "FCMB", BANK_CODE: "000003" },
  "first city": { BANK_NAME: "FCMB", BANK_CODE: "000003" },
  firstcity: { BANK_NAME: "FCMB", BANK_CODE: "000003" },
  "first city monument bank": { BANK_NAME: "FCMB", BANK_CODE: "000003" },
  firstcitymonumentbank: { BANK_NAME: "FCMB", BANK_CODE: "000003" },

  // FFS MFB aliases
  ffs: { BANK_NAME: "FFS MFB", BANK_CODE: "090153" },
  ffsmfb: { BANK_NAME: "FFS MFB", BANK_CODE: "090153" },

  // Fidelity Bank aliases
  fidelity: { BANK_NAME: "Fidelity Bank", BANK_CODE: "000007" },
  fidelitybank: { BANK_NAME: "Fidelity Bank", BANK_CODE: "000007" },

  // First Bank of Nigeria aliases
  firstbank: { BANK_NAME: "First Bank of Nigeria", BANK_CODE: "000016" },
  firstbankofnigeria: {
    BANK_NAME: "First Bank of Nigeria",
    BANK_CODE: "000016",
  },
  firstbanknigeria: { BANK_NAME: "First Bank of Nigeria", BANK_CODE: "000016" },

  // FSDH Merchant Bank aliases
  fsdh: { BANK_NAME: "FSDH Merchant Bank", BANK_CODE: "400001" },
  fsdhmerchant: { BANK_NAME: "FSDH Merchant Bank", BANK_CODE: "400001" },
  fsdhmerchantbank: { BANK_NAME: "FSDH Merchant Bank", BANK_CODE: "400001" },

  // Globus Bank aliases
  globus: { BANK_NAME: "Globus Bank", BANK_CODE: "000027" },
  globusbank: { BANK_NAME: "Globus Bank", BANK_CODE: "000027" },

  // GoMoney aliases
  gomoney: { BANK_NAME: "GoMoney", BANK_CODE: "100022" },
  "go money": { BANK_NAME: "GoMoney", BANK_CODE: "100022" },

  // GTBank / Guaranty Trust Bank aliases
  gtbank: { BANK_NAME: "GTBank (Guaranty Trust Bank)", BANK_CODE: "000013" },
  gtb: { BANK_NAME: "GTBank (Guaranty Trust Bank)", BANK_CODE: "000013" },
  "gt bank": { BANK_NAME: "GTBank (Guaranty Trust Bank)", BANK_CODE: "000013" },
  "guaranty trust bank": {
    BANK_NAME: "GTBank (Guaranty Trust Bank)",
    BANK_CODE: "000013",
  },
  guaranty: { BANK_NAME: "GTBank (Guaranty Trust Bank)", BANK_CODE: "000013" },

  // Heritage Bank aliases
  heritage: { BANK_NAME: "Heritage Bank", BANK_CODE: "000020" },
  heritagebank: { BANK_NAME: "Heritage Bank", BANK_CODE: "000020" },

  // JAIZ Bank aliases
  jaiz: { BANK_NAME: "JAIZ Bank", BANK_CODE: "000006" },
  jaizbank: { BANK_NAME: "JAIZ Bank", BANK_CODE: "000006" },

  // JubileeLife Mortage Bank aliases
  jubileelife: { BANK_NAME: "JubileeLife Mortage Bank", BANK_CODE: "090003" },
  mortagebank: { BANK_NAME: "JubileeLife Mortage Bank", BANK_CODE: "090003" },
  jubileelifemortage: {
    BANK_NAME: "JubileeLife Mortage Bank",
    BANK_CODE: "090003",
  },
  jubileelifemortagebank: {
    BANK_NAME: "JubileeLife Mortage Bank",
    BANK_CODE: "090003",
  },

  // KCMB MFB aliases
  kcmb: { BANK_NAME: "KCMB MFB", BANK_CODE: "090191" },
  kcmbmfb: { BANK_NAME: "KCMB MFB", BANK_CODE: "090191" },

  // Keystone Bank aliases
  keystone: { BANK_NAME: "Keystone Bank", BANK_CODE: "000002" },
  keystonebank: { BANK_NAME: "Keystone Bank", BANK_CODE: "000002" },

  // KrediMoney MFB aliases
  kredimoney: { BANK_NAME: "KrediMoney MFB", BANK_CODE: "090380" },
  "kredi money": { BANK_NAME: "KrediMoney MFB", BANK_CODE: "090380" },
  kredimoneymfb: { BANK_NAME: "KrediMoney MFB", BANK_CODE: "090380" },

  // Mainstreet MFB aliases
  mainstreet: { BANK_NAME: "Mainstreet MFB", BANK_CODE: "090171" },
  mainstreetmfb: { BANK_NAME: "Mainstreet MFB", BANK_CODE: "090171" },

  // Mint-Finex MFB aliases
  mintfinex: { BANK_NAME: "Mint-Finex MFB", BANK_CODE: "090281" },
  "mint-finex": { BANK_NAME: "Mint-Finex MFB", BANK_CODE: "090281" },
  mintfinexmfb: { BANK_NAME: "Mint-Finex MFB", BANK_CODE: "090281" },

  // Opay Digital Services aliases
  opay: { BANK_NAME: "Opay Digital Services Limited", BANK_CODE: "100004" },
  opey: { BANK_NAME: "Opay Digital Services Limited", BANK_CODE: "100004" },
  opaydigital: {
    BANK_NAME: "Opay Digital Services Limited",
    BANK_CODE: "100004",
  },
  opaysvc: { BANK_NAME: "Opay Digital Services Limited", BANK_CODE: "100004" },

  // Paga aliases
  paga: { BANK_NAME: "Paga", BANK_CODE: "100002" },

  // PalmPay aliases
  palmpay: { BANK_NAME: "PalmPay", BANK_CODE: "100033" },
  "palm pay": { BANK_NAME: "PalmPay", BANK_CODE: "100033" },

  // Parkway-ReadyCash aliases
  parkway: { BANK_NAME: "Parkway-ReadyCash", BANK_CODE: "100003" },
  readycash: { BANK_NAME: "Parkway-ReadyCash", BANK_CODE: "100003" },
  parkwayreadycash: { BANK_NAME: "Parkway-ReadyCash", BANK_CODE: "100003" },

  // Parallex Bank aliases
  parallex: { BANK_NAME: "Parallex Bank", BANK_CODE: "000030" },
  parallexbank: { BANK_NAME: "Parallex Bank", BANK_CODE: "000030" },

  // PayAttitude Online aliases
  payattitude: { BANK_NAME: "PayAttitude Online", BANK_CODE: "110001" },
  payattitudeonline: { BANK_NAME: "PayAttitude Online", BANK_CODE: "110001" },

  // Polaris Bank aliases
  polaris: { BANK_NAME: "Polaris Bank", BANK_CODE: "000008" },
  polarisbank: { BANK_NAME: "Polaris Bank", BANK_CODE: "000008" },

  // Providus Bank aliases
  providus: { BANK_NAME: "Providus Bank", BANK_CODE: "000023" },
  providusbank: { BANK_NAME: "Providus Bank", BANK_CODE: "000023" },

  // Rand Merchant Bank aliases
  rand: { BANK_NAME: "Rand Merchant Bank", BANK_CODE: "000024" },
  randmerchant: { BANK_NAME: "Rand Merchant Bank", BANK_CODE: "000024" },
  randmerchantbank: { BANK_NAME: "Rand Merchant Bank", BANK_CODE: "000024" },

  // Rolez MFB aliases
  rolez: { BANK_NAME: "Rolez MFB", BANK_CODE: "090405" },
  rolezmfb: { BANK_NAME: "Rolez MFB", BANK_CODE: "090405" },

  // Rubies aliases
  rubies: { BANK_NAME: "Rubies", BANK_CODE: "090175" },

  // Safe Haven MFB aliases
  safehaven: { BANK_NAME: "Safe Haven MFB", BANK_CODE: "051113" },
  safehavenmfb: { BANK_NAME: "Safe Haven MFB", BANK_CODE: "051113" },

  // Sparkle MFB aliases
  sparkle: { BANK_NAME: "Sparkle MFB", BANK_CODE: "090325" },
  sparklemfb: { BANK_NAME: "Sparkle MFB", BANK_CODE: "090325" },

  // Stanbic IBTC Bank aliases
  stanbicibtc: { BANK_NAME: "Stanbic IBTC Bank", BANK_CODE: "000012" },
  ibtc: { BANK_NAME: "Stanbic IBTC Bank", BANK_CODE: "000012" },
  stanbic: { BANK_NAME: "Stanbic IBTC Bank", BANK_CODE: "000012" },

  // Stanbic Mobile Money aliases
  stanbicmobile: { BANK_NAME: "Stanbic Mobile Money", BANK_CODE: "100007" },
  stanbicmobilemoney: {
    BANK_NAME: "Stanbic Mobile Money",
    BANK_CODE: "100007",
  },

  // Standard Chartered Bank aliases
  standardchartered: {
    BANK_NAME: "Standard Chartered Bank",
    BANK_CODE: "000021",
  },
  chartered: { BANK_NAME: "Standard Chartered Bank", BANK_CODE: "000021" },
  standardcharteredbank: {
    BANK_NAME: "Standard Chartered Bank",
    BANK_CODE: "000021",
  },

  // Sterling Bank aliases
  sterling: { BANK_NAME: "Sterling Bank", BANK_CODE: "000001" },
  sterlingbank: { BANK_NAME: "Sterling Bank", BANK_CODE: "000001" },

  // Suntrust Bank aliases
  suntrust: { BANK_NAME: "Suntrust Bank", BANK_CODE: "000022" },
  suntrustbank: { BANK_NAME: "Suntrust Bank", BANK_CODE: "000022" },

  // TAJ Bank aliases
  taj: { BANK_NAME: "TAJ Bank", BANK_CODE: "000026" },
  tajbank: { BANK_NAME: "TAJ Bank", BANK_CODE: "000026" },

  // Tangerine Money aliases
  tangerine: { BANK_NAME: "Tangerine Money", BANK_CODE: "090426" },
  tangerinemoney: { BANK_NAME: "Tangerine Money", BANK_CODE: "090426" },

  // Titan Trust Bank aliases
  titan: { BANK_NAME: "Titan Trust Bank", BANK_CODE: "000025" },
  titantrust: { BANK_NAME: "Titan Trust Bank", BANK_CODE: "000025" },
  titantrustbank: { BANK_NAME: "Titan Trust Bank", BANK_CODE: "000025" },

  // Union Bank aliases
  union: { BANK_NAME: "Union Bank", BANK_CODE: "000018" },
  unionbank: { BANK_NAME: "Union Bank", BANK_CODE: "000018" },

  // United Bank for Africa (UBA) aliases
  uba: { BANK_NAME: "United Bank for Africa (UBA)", BANK_CODE: "000004" },
  unitedbank: {
    BANK_NAME: "United Bank for Africa (UBA)",
    BANK_CODE: "000004",
  },
  unitedbankforafrica: {
    BANK_NAME: "United Bank for Africa (UBA)",
    BANK_CODE: "000004",
  },

  // Unity Bank aliases
  unity: { BANK_NAME: "Unity Bank", BANK_CODE: "000011" },
  unitybank: { BANK_NAME: "Unity Bank", BANK_CODE: "000011" },

  // VFD MFB aliases
  vfd: { BANK_NAME: "VFD MFB", BANK_CODE: "090110" },
  vfdmfb: { BANK_NAME: "VFD MFB", BANK_CODE: "090110" },

  // Wema Bank aliases
  wema: { BANK_NAME: "Wema Bank", BANK_CODE: "000017" },
  wemabank: { BANK_NAME: "Wema Bank", BANK_CODE: "000017" },

  // Zenith Bank Plc aliases
  zenith: { BANK_NAME: "Zenith Bank Plc", BANK_CODE: "000015" },
  zenithbank: { BANK_NAME: "Zenith Bank Plc", BANK_CODE: "000015" },
  zenithbankplc: { BANK_NAME: "Zenith Bank Plc", BANK_CODE: "000015" },

  // Zinternet / KongaPay aliases
  zinternet: { BANK_NAME: "Zinternet - KongaPay", BANK_CODE: "100025" },
  konga: { BANK_NAME: "Zinternet - KongaPay", BANK_CODE: "100025" },
  kongapay: { BANK_NAME: "Zinternet - KongaPay", BANK_CODE: "100025" },
  zinternetkongapay: { BANK_NAME: "Zinternet - KongaPay", BANK_CODE: "100025" },
};
