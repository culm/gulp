;
(function(A) {
    A.mapping.data = {
        // 金饭碗
        '10002': {
            // 北京
            '1000': {
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "clinicPay": "门诊大额支付",
                        "retirementPay": "退休补充支付",
                        "disabledPay": "残军补助支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "fundPay": "基金支付",
                        "medicareScopeMoney": "本次医保范围内金额",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "totalUpperCase": "合计大写",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "printDate": "就诊日期",
                        "thirdpartypay": "第三方支付金额",
                        "thirdininsurance": "第三方医保范围内金额",
                        "thirdoutinsurance": "第三方医保范围外金额"
                    },
                    invoiceDetailMapping: {
                        "item": "名称",
                        "spec": "规格",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "入院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "totalUpperCase": "合计大写",
                        "fundPay": "基金支付",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "thirdpartypay": "第三方支付金额",
                        "thirdininsurance": "第三方医保范围内金额",
                        "thirdoutinsurance": "第三方医保范围外金额"
                    },
                    invoiceDetailMapping: {
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                }
            },
            // 上海
            '2000': {
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "totalUpperCase": "合计大写",
                        "xianjinzhifu": "现金支付",
                        "payPersonAcount": "个人账户支付",
                        "sum": "合计小写",
                        "printDate": "日期",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "selfPayTwo": "分类自负",
                        "zifu": "自负",
                        "selfPayFee": "自费",
                        "thirdpartypay": "第三方支付金额",
                        "thirdininsurance": "第三方医保范围内金额",
                        "thirdoutinsurance": "第三方医保范围外金额"
                    },
                    invoiceDetailMapping: {
                        "itemCode": "编码",
                        "grade": "等级",
                        "selfPayRate": "比例",
                        "item": "名称",
                        "spec": "规格",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "住院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "totalUpperCase": "合计大写",
                        "sum": "合计小写",
                        "xianjinzhifu": "现金支付",
                        "payPersonAcount": "个人账户支付",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "selfPayTwo": "分类自负",
                        "zifu": "自负",
                        "selfPayFee": "自费",
                        "thirdpartypay": "第三方支付金额",
                        "thirdininsurance": "第三方医保范围内金额",
                        "thirdoutinsurance": "第三方医保范围外金额"
                    },
                    invoiceDetailMapping: {
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                }
            },
            // 其他地区
            '0000': {
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "clinicPay": "门诊大额支付",
                        "retirementPay": "退休补充支付",
                        "disabledPay": "残军补助支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "fundPay": "基金支付",
                        "medicareScopeMoney": "本次医保范围内金额",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "totalUpperCase": "合计大写",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "printDate": "就诊日期",
                        "thirdpartypay": "第三方支付金额",
                        "thirdininsurance": "第三方医保范围内金额",
                        "thirdoutinsurance": "第三方医保范围外金额"
                    },
                    invoiceDetailMapping: {
                        "item": "名称",
                        "spec": "规格",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "入院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "totalUpperCase": "合计大写",
                        "fundPay": "基金支付",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "thirdpartypay": "第三方支付金额",
                        "thirdininsurance": "第三方医保范围内金额",
                        "thirdoutinsurance": "第三方医保范围外金额"
                    },
                    invoiceDetailMapping: {
                        "item": "名称",
                        "spec": "规格",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级"
                    }
                }
            }
        },
        // 新安怡
        '10003': {
            // 北京
            '1000': {
                '300': {
                    invoiceMapping: {
                        "hospitalizedNo": "住院号",
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "入院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "medicareScopeMoney": "医疗保险范围内金额",
                        "fundPay": "医疗保险基金支付金额",
                        "healthcarePay": "统筹基金支付",
                        "daehuzhuzijinzhifu": "大额互助资金（住院）支付",
                        "retirementPay": "退休人员补充医疗保险支付",
                        "unitAddPay": "单位补充医疗保险（原公疗）",
                        "disabledPay": "残疾军人医疗补助支付",
                        "payPerson": "个人自付、自费金额",
                        "sum": "合计小写",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费金额",
                        "thirdpartypay": "第三方支付金额",
                        "thirdPayCompany": "第三方支付单位名称",
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                        "inHospitalDiagnoseCh2": "疾病诊断名称2",
                        "inHospitalDiagnose2": "ICD-10编码",
                        "inHospitalDiagnoseCh3": "疾病诊断名称3",
                        "inHospitalDiagnose3": "ICD-10编码",
                        "inHospitalDiagnoseCh4": "疾病诊断名称4",
                        "inHospitalDiagnose4": "ICD-10编码",
                        "inHospitalDiagnoseCh5": "疾病诊断名称5",
                        "inHospitalDiagnose5": "ICD-10编码"
                    },
                    invoiceDetailMapping: {
                        "itemCode": "费用类型",
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                },
                '400': {
                    invoiceMapping: {
                        "hospitalizedNo": "住院号",
                        "name": "姓名",
                        "gender": "性别",
                        "cardType": "证件类型",
                        "cardId": "证件号码"
                    },
                    invoiceDetailMapping: {
                        "itemCode": "药品代码",
                        "itemName": "药品名称",
                        "specification": "规格",
                        "dosageForm": "剂型",
                        "unit": "单位",
                        "price": "单价",
                        "amount": "数量",
                        "actualPrice": "金额",
                        "medicareType": "医保类型",
                        "egoRatio": "自付比例",
                        "egoPrice": "自付金额"
                    }
                },
                '3000': {
                    invoiceMapping: {
                        "accidentDate": "出险日期",
                        "accidentCode": "出险类型",
                        "name": "被保人姓名",
                        "gender": "性别",
                        "certificateType": "证件类型",
                        "idNumber": "证件号码",
                        "mobile": "手机",
                        "telephone": "座机",
                        "bankName": "开户行",
                        "bankAccountNo": "银行账号"
                    },
                    invoiceDetailMapping: {
                        "recipient": "是否是领款人",
                        "relation": "与被保险人关系",
                        "name": "姓名",
                        "gender": "性别",
                        "certificateType": "证件类型",
                        "idNumber": "证件号码",
                        "mobile": "手机",
                        "telephone": "座机",
                        "bankName": "开户行",
                        "bankAccountNo": "银行账号"
                    }
                }
            },
            // 上海
            '2000': {
                '300': {
                    invoiceMapping: {
                        "hospitalizedNo": "住院号",
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "住院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "sum": "合计小写",
                        "xianjinzhifu": "现金支付",
                        "payPersonAcount": "个人账户支付",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "selfPayTwo": "分类自负",
                        "zifu": "自负",
                        "selfPayFee": "自费",
                        "thirdpartypay": "第三方支付金额",
                        "thirdPayCompany": "第三方支付单位名称",
                        "inHospitalDiagnoseCh": "疾病诊断",
                        "inHospitalDiagnose": "ICD编码",
                        "inHospitalDiagnoseCh2": "疾病诊断2",
                        "inHospitalDiagnose2": "ICD编码",
                        "inHospitalDiagnoseCh3": "疾病诊断3",
                        "inHospitalDiagnose3": "ICD编码",
                        "inHospitalDiagnoseCh4": "疾病诊断4",
                        "inHospitalDiagnose4": "ICD编码",
                        "inHospitalDiagnoseCh5": "疾病诊断5",
                        "inHospitalDiagnose5": "ICD编码"
                    },
                    invoiceDetailMapping: {
                        "itemCode": "费用类型",
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                },
                '400': {
                    invoiceMapping: {
                        "hospitalizedNo": "住院号",
                        "name": "姓名",
                        "gender": "性别",
                        "cardType": "证件类型",
                        "cardId": "证件号码"
                    },
                    invoiceDetailMapping: {
                        "itemCode": "药品代码",
                        "itemName": "药品名称",
                        "specification": "规格",
                        "dosageForm": "剂型",
                        "unit": "单位",
                        "price": "单价",
                        "amount": "数量",
                        "actualPrice": "金额",
                        "medicareType": "医保类型",
                        "egoRatio": "自付比例",
                        "egoPrice": "自付金额"
                    }
                },
                '3000': {
                    invoiceMapping: {
                        "accidentDate": "出险日期",
                        "accidentCode": "出险类型",
                        "name": "被保人姓名",
                        "gender": "性别",
                        "certificateType": "证件类型",
                        "idNumber": "证件号码",
                        "mobile": "手机",
                        "telephone": "座机",
                        "bankName": "开户行",
                        "bankAccountNo": "银行账号"
                    },
                    invoiceDetailMapping: {
                        "recipient": "是否是领款人",
                        "relation": "与被保险人关系",
                        "name": "姓名",
                        "gender": "性别",
                        "certificateType": "证件类型",
                        "idNumber": "证件号码",
                        "mobile": "手机",
                        "telephone": "座机",
                        "bankName": "开户行",
                        "bankAccountNo": "银行账号"
                    }
                }
            },
            // 其他地区
            '0000': {
                '300': {
                    invoiceMapping: {
                        "hospitalizedNo": "住院号",
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "住院时间",
                        "leaveHospitalDate": "出院时间",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "sum": "合计小写",
                        "healthcarePay": "医保统筹支付",
                        "payPersonAcount": "个人账户支付",
                        "qitayibaozhifu": "其他医保支付",
                        "payPerson": "个人支付金额",
                        "selfPayFee": "自费金额",
                        "selfPayTwo": "分类自负金额",
                        "thirdpartypay": "第三方支付金额",
                        "thirdPayCompany": "第三方支付单位名称",
                        "inHospitalDiagnoseCh": "疾病诊断",
                        "inHospitalDiagnose": "ICD-10编码",
                        "inHospitalDiagnoseCh2": "疾病诊断2",
                        "inHospitalDiagnose2": "ICD-10编码",
                        "inHospitalDiagnoseCh3": "疾病诊断3",
                        "inHospitalDiagnose3": "ICD-10编码",
                        "inHospitalDiagnoseCh4": "疾病诊断4",
                        "inHospitalDiagnose4": "ICD-10编码",
                        "inHospitalDiagnoseCh5": "疾病诊断5",
                        "inHospitalDiagnose5": "ICD-10编码"
                    },
                    invoiceDetailMapping: {
                        "itemCode": "费用类型",
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                },
                '400': {
                    invoiceMapping: {
                        "hospitalizedNo": "住院号",
                        "name": "姓名",
                        "gender": "性别",
                        "cardType": "证件类型",
                        "cardId": "证件号码"
                    },
                    invoiceDetailMapping: {
                        "itemCode": "药品代码",
                        "itemName": "药品名称",
                        "specification": "规格",
                        "dosageForm": "剂型",
                        "unit": "单位",
                        "price": "单价",
                        "amount": "数量",
                        "actualPrice": "金额",
                        "medicareType": "医保类型",
                        "egoRatio": "自付比例",
                        "egoPrice": "自付金额"
                    }
                },
                '3000': {
                    invoiceMapping: {
                        "accidentDate": "出险日期",
                        "accidentCode": "出险类型",
                        "name": "被保人姓名",
                        "gender": "性别",
                        "certificateType": "证件类型",
                        "idNumber": "证件号码",
                        "mobile": "手机",
                        "telephone": "座机",
                        "bankName": "开户行",
                        "bankAccountNo": "银行账号"
                    },
                    invoiceDetailMapping: {
                        "recipient": "是否是领款人",
                        "relation": "与被保险人关系",
                        "name": "姓名",
                        "gender": "性别",
                        "certificateType": "证件类型",
                        "idNumber": "证件号码",
                        "mobile": "手机",
                        "telephone": "座机",
                        "bankName": "开户行",
                        "bankAccountNo": "银行账号"
                    }
                }
            }
        },
        // 太保移动
        '10004': {
            // 北京
            '1000': {
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "clinicPay": "门诊大额支付",
                        "retirementPay": "退休补充支付",
                        "disabledPay": "残军补助支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "fundPay": "基金支付",
                        "medicareScopeMoney": "本次医保范围内金额",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "printDate": "就诊日期",
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                        "inHospitalDiagnoseCh2": "疾病诊断名称2",
                        "inHospitalDiagnose2": "ICD-10编码",
                        "inHospitalDiagnoseCh3": "疾病诊断名称3",
                        "inHospitalDiagnose3": "ICD-10编码",
                        "inHospitalDiagnoseCh4": "疾病诊断名称4",
                        "inHospitalDiagnose4": "ICD-10编码",
                        "inHospitalDiagnoseCh5": "疾病诊断名称5",
                        "inHospitalDiagnose5": "ICD-10编码"
                    },
                    invoiceDetailMapping: {
                        "bigItemCode":"费用归类", //展示费用归类名称， 传费用归类编码
                        "type":"类型",//药品、耗材
                        "itemCode":"费用编码",
                        "item": "名称",
                        "spec": "规格",
                        "dosage":"剂型",
                        "unit":"单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "zifei":"自费金额",
                        "grade": "等级",
                        "selfPayRadio":"自付比例"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "入院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "medicareScopeMoney": "医疗保险范围内金额",
                        "fundPay": "医疗保险基金支付金额",
                        "healthcarePay": "统筹基金支付",
                        "daehuzhuzijinzhifu": "大额互助资金（住院）支付",
                        "retirementPay": "退休人员补充医疗保险支付",
                        "unitAddPay": "单位补充医疗保险（原公疗）",
                        "disabledPay": "残疾军人医疗补助支付",
                        "payPerson": "个人自付、自费金额",
                        "sum": "合计小写",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费金额",
                        "thirdpartypay": "第三方支付金额",
                        "thirdPayCompany": "第三方支付单位名称",
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                        "inHospitalDiagnoseCh2": "疾病诊断名称2",
                        "inHospitalDiagnose2": "ICD-10编码",
                        "inHospitalDiagnoseCh3": "疾病诊断名称3",
                        "inHospitalDiagnose3": "ICD-10编码",
                        "inHospitalDiagnoseCh4": "疾病诊断名称4",
                        "inHospitalDiagnose4": "ICD-10编码",
                        "inHospitalDiagnoseCh5": "疾病诊断名称5",
                        "inHospitalDiagnose5": "ICD-10编码"
                    },
                    invoiceDetailMapping: {
                        "bigItemCode":"费用归类", //展示费用归类名称， 传费用归类编码
                        "type":"类型",//药品、耗材
                        "itemCode":"费用编码",
                        "item": "名称",
                        "spec": "规格",
                        "dosage":"剂型",
                        "unit":"单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "zifei":"自费金额",
                        "grade": "等级",
                        "selfPayRadio":"自付比例"                    }
                },
                '400': {
                    invoiceMapping: {
                        "invoiceNo": "NO号"
                    },
                    invoiceDetailMapping: {
                        "bigItemCode":"费用归类", //展示费用归类名称， 传费用归类编码
                        "type":"类型",//药品、耗材
                        "itemCode":"费用编码",
                        "itemName": "名称",
                        "specification": "规格",
                        "dosageForm":"剂型",
                        "unit":"单位",
                        "amount": "数量",
                        "price": "单价",
                        "actualPrice": "金额",
                        "egoPrice":"自费金额",
                        "medicareType": "等级",
                        "egoRatio":"自付比例"
                    }
                },
                '410': {
                    invoiceMapping: {
                        "invoiceNo": "NO号"
                    },
                    invoiceDetailMapping: {
                        "bigItemCode":"费用归类", //展示费用归类名称， 传费用归类编码
                        "type":"类型",//药品、耗材
                        "itemCode":"费用编码",
                        "itemName": "名称",
                        "specification": "规格",
                        "dosageForm":"剂型",
                        "unit":"单位",
                        "amount": "数量",
                        "price": "单价",
                        "actualPrice": "金额",
                        "egoPrice":"自费金额",
                        "medicareType": "等级",
                        "egoRatio":"自付比例"
                    }
                }
            },
            // 上海
            '2000': {
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "xianjinzhifu": "现金支付",
                        "payPersonAcount": "个人账户支付",
                        "sum": "合计小写",
                        "printDate": "日期",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "selfPayTwo": "分类自负",
                        "zifu": "自负",
                        "selfPayFee": "自费",
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                        "inHospitalDiagnoseCh2": "疾病诊断名称2",
                        "inHospitalDiagnose2": "ICD-10编码",
                        "inHospitalDiagnoseCh3": "疾病诊断名称3",
                        "inHospitalDiagnose3": "ICD-10编码",
                        "inHospitalDiagnoseCh4": "疾病诊断名称4",
                        "inHospitalDiagnose4": "ICD-10编码",
                        "inHospitalDiagnoseCh5": "疾病诊断名称5",
                        "inHospitalDiagnose5": "ICD-10编码"
                    },
                    invoiceDetailMapping: {
                        "bigItemCode":"费用归类", //展示费用归类名称， 传费用归类编码
                        "type":"类型",//药品、耗材
                        "itemCode":"费用编码",
                        "item": "名称",
                        "spec": "规格",
                        "dosage":"剂型",
                        "unit":"单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "zifei":"自费金额",
                        "grade": "等级",
                        "selfPayRadio":"自付比例"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "住院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "sum": "合计小写",
                        "xianjinzhifu": "现金支付",
                        "payPersonAcount": "个人账户支付",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "selfPayTwo": "分类自负",
                        "zifu": "自负",
                        "selfPayFee": "自费",
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                        "inHospitalDiagnoseCh2": "疾病诊断名称2",
                        "inHospitalDiagnose2": "ICD-10编码",
                        "inHospitalDiagnoseCh3": "疾病诊断名称3",
                        "inHospitalDiagnose3": "ICD-10编码",
                        "inHospitalDiagnoseCh4": "疾病诊断名称4",
                        "inHospitalDiagnose4": "ICD-10编码",
                        "inHospitalDiagnoseCh5": "疾病诊断名称5",
                        "inHospitalDiagnose5": "ICD-10编码"
                    },
                    invoiceDetailMapping: {
                        "bigItemCode":"费用归类", //展示费用归类名称， 传费用归类编码
                        "type":"类型",//药品、耗材
                        "itemCode":"费用编码",
                        "item": "名称",
                        "spec": "规格",
                        "dosage":"剂型",
                        "unit":"单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "zifei":"自费金额",
                        "grade": "等级",
                        "selfPayRadio":"自付比例"
                    }
                },
                '400': {
                    invoiceMapping: {
                        "invoiceNo": "NO号"
                    },
                    invoiceDetailMapping: {
                        "bigItemCode":"费用归类", //展示费用归类名称， 传费用归类编码
                        "type":"类型",//药品、耗材
                        "itemCode":"费用编码",
                        "itemName": "名称",
                        "specification": "规格",
                        "dosageForm":"剂型",
                        "unit":"单位",
                        "amount": "数量",
                        "price": "单价",
                        "actualPrice": "金额",
                        "egoPrice":"自费金额",
                        "medicareType": "等级",
                        "egoRatio":"自付比例"
                    }
                },
                '410': {
                    invoiceMapping: {
                        "invoiceNo": "NO号"
                    },
                    invoiceDetailMapping: {
                        "bigItemCode":"费用归类", //展示费用归类名称， 传费用归类编码
                        "type":"类型",//药品、耗材
                        "itemCode":"费用编码",
                        "itemName": "名称",
                        "specification": "规格",
                        "dosageForm":"剂型",
                        "unit":"单位",
                        "amount": "数量",
                        "price": "单价",
                        "actualPrice": "金额",
                        "egoPrice":"自费金额",
                        "medicareType": "等级",
                        "egoRatio":"自付比例"
                    }
                }
            },
            // 其他地区
            '0000': {
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "clinicPay": "门诊大额支付",
                        "retirementPay": "退休补充支付",
                        "disabledPay": "残军补助支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "fundPay": "基金支付",
                        "medicareScopeMoney": "本次医保范围内金额",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "printDate": "就诊日期",
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                        "inHospitalDiagnoseCh2": "疾病诊断名称2",
                        "inHospitalDiagnose2": "ICD-10编码",
                        "inHospitalDiagnoseCh3": "疾病诊断名称3",
                        "inHospitalDiagnose3": "ICD-10编码",
                        "inHospitalDiagnoseCh4": "疾病诊断名称4",
                        "inHospitalDiagnose4": "ICD-10编码",
                        "inHospitalDiagnoseCh5": "疾病诊断名称5",
                        "inHospitalDiagnose5": "ICD-10编码"
                    },
                    invoiceDetailMapping: {
                        "bigItemCode":"费用归类", //展示费用归类名称， 传费用归类编码
                        "type":"类型",//药品、耗材
                        "itemCode":"费用编码",
                        "item": "名称",
                        "spec": "规格",
                        "dosage":"剂型",
                        "unit":"单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "zifei":"自费金额",
                        "grade": "等级",
                        "selfPayRadio":"自付比例"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "住院时间",
                        "leaveHospitalDate": "出院时间",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "sum": "合计小写",
                        "healthcarePay": "医保统筹支付",
                        "payPersonAcount": "个人账户支付",
                        "qitayibaozhifu": "其他医保支付",
                        "payPerson": "个人支付金额",
                        "selfPayFee": "自费金额",
                        "selfPayTwo": "分类自负金额",
                        "thirdpartypay": "第三方支付金额",
                        "thirdPayCompany": "第三方支付单位名称",
                        "inHospitalDiagnoseCh": "疾病诊断",
                        "inHospitalDiagnose": "ICD-10编码",
                        "inHospitalDiagnoseCh2": "疾病诊断2",
                        "inHospitalDiagnose2": "ICD-10编码",
                        "inHospitalDiagnoseCh3": "疾病诊断3",
                        "inHospitalDiagnose3": "ICD-10编码",
                        "inHospitalDiagnoseCh4": "疾病诊断4",
                        "inHospitalDiagnose4": "ICD-10编码",
                        "inHospitalDiagnoseCh5": "疾病诊断5",
                        "inHospitalDiagnose5": "ICD-10编码"
                    },
                    invoiceDetailMapping: {
                        "bigItemCode":"费用归类", //展示费用归类名称， 传费用归类编码
                        "type":"类型",//药品、耗材
                        "itemCode":"费用编码",
                        "item": "名称",
                        "spec": "规格",
                        "dosage":"剂型",
                        "unit":"单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "zifei":"自费金额",
                        "grade": "等级",
                        "selfPayRadio":"自付比例"
                    }
                },
                '400': {
                    invoiceMapping: {
                        "invoiceNo": "NO号"
                    },
                    invoiceDetailMapping: {
                        "bigItemCode":"费用归类", //展示费用归类名称， 传费用归类编码
                        "type":"类型",//药品、耗材
                        "itemCode":"费用编码",
                        "itemName": "名称",
                        "specification": "规格",
                        "dosageForm":"剂型",
                        "unit":"单位",
                        "amount": "数量",
                        "price": "单价",
                        "actualPrice": "金额",
                        "egoPrice":"自费金额",
                        "medicareType": "等级",
                        "egoRatio":"自付比例"
                    }
                },
                '410': {
                    invoiceMapping: {
                        "invoiceNo": "NO号"
                    },
                    invoiceDetailMapping: {
                        "bigItemCode":"费用归类", //展示费用归类名称， 传费用归类编码
                        "type":"类型",//药品、耗材
                        "itemCode":"费用编码",
                        "itemName": "名称",
                        "specification": "规格",
                        "dosageForm":"剂型",
                        "unit":"单位",
                        "amount": "数量",
                        "price": "单价",
                        "actualPrice": "金额",
                        "egoPrice":"自费金额",
                        "medicareType": "等级",
                        "egoRatio":"自付比例"
                    }
                }
            }
        },
        // fesco
        '10005': {
            // 北京
            '1000': {
                '100': {
                    invoiceMapping: {
                        "department": "就诊科室",
                        "diagnoise": "诊断结论",
                        "diagnoise2": "诊断结论2",
                        "diagnoise3": "诊断结论3",
                        "diagnoise4": "诊断结论4",
                        "diagnoise5": "诊断结论5",
                        "doctor": "医生"
                    }
                },
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "clinicPay": "门诊大额支付",
                        "retirementPay": "退休补充支付",
                        "disabledPay": "残军补助支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "fundPay": "基金支付",
                        "medicareScopeMoney": "本次医保范围内金额",
                        "totalMedRange": "累计医保范围内金额",
                        "yearClinicPay": "年度门诊大额累计支付",
                        "personalMoney": "个人账户余额",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "printDate": "就诊日期"
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "入院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "fundPay": "基金支付",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "healthcarePay": "统筹基金支付",
                        "daehuzhuzijinzhifu": "住院大额支付",
                        "retirementPay": "退休人员补充医疗保险支付",
                        "medicareScopeMoney": "医疗保险范围内金额",
                        "benniandutongchoujijinleijizhifu": "年度统筹基金累计支付",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费金额"
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                },
                '600': {
                    invoiceMapping: {
                        "department": "就诊科室",
                        "diagnoise": "诊断结论",
                        "diagnoise2": "诊断结论2",
                        "diagnoise3": "诊断结论3",
                        "diagnoise4": "诊断结论4",
                        "diagnoise5": "诊断结论5",
                    }
                },
                '900': {
                    invoiceMapping: {
                        "clinicPay": "门诊大额支付",
                        "retirementPay": "退休补充支付",
                        "disabledPay": "残军补助支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "fundPay": "基金支付",
                        "medicareScopeMoney": "本次医保范围内金额",
                        "medicareScopeAllMoney": "累计医保内范围金额",
                        "yearClinicPay": "年度门诊大额累计支付",
                        "payPersonAcount": "个人账户支付",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "payPerson": "个人支付金额",
                        "sum": "合计金额"
                    },
                    invoiceDetailMapping: {
                        /*"detailParent": "大项",
                        "item": "名称",
                        "moneyAmount": "金额",
                        "grade": "等级"*/
                        "detailParent": "大项",
                        "item": "名称",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '910': {
                    invoiceMapping: {
                        "medicareScopeMoney": "医疗保险范围内金额",
                        "healthcarePay": "统筹基金支付",
                        "daehuzhuzijinzhifu": "大额互助资金（住院）支付",
                        "retirementPay": "退休人员补充医疗保险支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "disabledPay": "残疾军人医疗补助支付s",
                        "payPerson": "本次个人现金支付金额",
                        "benniandutongchoujijinleijizhifu": "本年度统筹基金累计支付", 
                        "benniandudaehuzhuzijinleijizhifu": "本年度大额互助资金【住院】累计支付",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "payPersonAcount": "本次个人账户支付金额",
                        "sum": "合计金额",
                    }
                }
            },
            // 上海
            '2000': {
                '100': {
                    invoiceMapping: {
                        "department": "就诊科室",
                        "diagnoise": "诊断结论",
                        "diagnoise2": "诊断结论2",
                        "diagnoise3": "诊断结论3",
                        "diagnoise4": "诊断结论4",
                        "diagnoise5": "诊断结论5",
                        "doctor":"医生"
                    }
                },
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "sum": "合计小写",
                        "xianjinzhifu": "现金支付",
                        "payPersonAcount": "个人账户支付",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "selfPayTwo": "分类自负",
                        "zifu": "自负",
                        "selfPayFee": "自费",
                        "printDate": "就诊日期",
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "住院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "xianjinzhifu": "现金支付",
                        "payPersonAcount": "个人账户支付",
                        "sum": "合计小写",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "selfPayTwo": "分类自负",
                        "zifu": "自负",
                        "selfPayFee": "自费",
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                },
                '600': {
                    invoiceMapping: {
                        "department": "就诊科室",
                        "diagnoise": "诊断结论",
                        "diagnoise2": "诊断结论2",
                        "diagnoise3": "诊断结论3",
                        "diagnoise4": "诊断结论4",
                        "diagnoise5": "诊断结论5",
                    }
                },
                '900': {
                    invoiceMapping: {
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "payPersonAcount": "个人账户支付",
                        "zifu": "自负",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "xianjinzhifu": "现金支付",
                        "sum": "合计金额"
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "moneyAmount": "金额",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '910': {
                    invoiceMapping: {
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "payPersonAcount": "个人账户支付",
                        "zifu": "自负",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "xianjinzhifu": "现金支付",
                        "sum": "合计金额"
                    }
                }
            },
            // 其他地区
            '0000': {
                '100': {
                    invoiceMapping: {
                        "department": "就诊科室",
                        "diagnoise": "诊断结论",
                        "diagnoise2": "诊断结论2",
                        "diagnoise3": "诊断结论3",
                        "diagnoise4": "诊断结论4",
                        "diagnoise5": "诊断结论5",
                        "doctor":"医生"
                    }
                },
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "healthcarePay": "医保统筹支付",
                        "qitayibaozhifu":"其他医保支付",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "sum": "合计小写",
                        "printDate": "就诊日期"
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "入院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "sum": "合计小写",
                        "healthcarePay": "医保统筹支付",
                        "qitayibaozhifu":"其他医保支付",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费"
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                },
                '600': {
                    invoiceMapping: {
                        "department": "就诊科室",
                        "diagnoise": "诊断结论",
                        "diagnoise2": "诊断结论2",
                        "diagnoise3": "诊断结论3",
                        "diagnoise4": "诊断结论4",
                        "diagnoise5": "诊断结论5",
                    }
                },
                '900': {
                    invoiceMapping: {
                        "healthcarePay": "医保统筹支付",
                        "qitayibaozhifu":"其他医保支付",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "sum": "合计金额",
                    },
                    invoiceDetailMapping: {
                        /*"detailParent": "大项",
                        "item": "名称",
                        "moneyAmount": "金额",
                        "grade": "等级"*/
                        "detailParent": "大项",
                        "item": "名称",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '910': {
                    invoiceMapping: {
                        "healthcarePay": "医保统筹支付",
                        "qitayibaozhifu":"其他医保支付",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "sum": "合计金额",
                    }
                }
            }
        },
        // fesco外包
        '10009': {
            // 北京
            '1000': {
                '100': {
                    invoiceMapping: {
                        "department": "就诊科室",
                        "diagnoise": "诊断结论",
                        "diagnoise2": "诊断结论2",
                        "diagnoise3": "诊断结论3",
                        "diagnoise4": "诊断结论4",
                        "diagnoise5": "诊断结论5",
                        "doctor": "医生"
                    }
                },
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "clinicPay": "门诊大额支付",
                        "retirementPay": "退休补充支付",
                        "disabledPay": "残军补助支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "fundPay": "基金支付",
                        "medicareScopeMoney": "本次医保范围内金额",
                        "totalMedRange": "累计医保范围内金额",
                        "yearClinicPay": "年度门诊大额累计支付",
                        "personalMoney": "个人账户余额",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "printDate": "就诊日期"
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "入院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "fundPay": "基金支付",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "healthcarePay": "统筹基金支付",
                        "daehuzhuzijinzhifu": "住院大额支付",
                        "retirementPay": "退休人员补充医疗保险支付",
                        "medicareScopeMoney": "医疗保险范围内金额",
                        "benniandutongchoujijinleijizhifu": "年度统筹基金累计支付",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费金额"
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                },
                '600': {
                    invoiceMapping: {
                        "department": "就诊科室",
                        "diagnoise": "诊断结论",
                        "diagnoise2": "诊断结论2",
                        "diagnoise3": "诊断结论3",
                        "diagnoise4": "诊断结论4",
                        "diagnoise5": "诊断结论5",
                    }
                },
                '900': {
                    invoiceMapping: {
                        "clinicPay": "门诊大额支付",
                        "retirementPay": "退休补充支付",
                        "disabledPay": "残军补助支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "fundPay": "基金支付",
                        "medicareScopeMoney": "本次医保范围内金额",
                        "medicareScopeAllMoney": "累计医保内范围金额",
                        "yearClinicPay": "年度门诊大额累计支付",
                        "payPersonAcount": "个人账户支付",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "payPerson": "个人支付金额",
                        "sum": "合计金额"
                    },
                    invoiceDetailMapping: {
                        /*"detailParent": "大项",
                        "item": "名称",
                        "moneyAmount": "金额",
                        "grade": "等级"*/
                        "detailParent": "大项",
                        "item": "名称",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '910': {
                    invoiceMapping: {
                        "medicareScopeMoney": "医疗保险范围内金额",
                        "healthcarePay": "统筹基金支付",
                        "daehuzhuzijinzhifu": "大额互助资金（住院）支付",
                        "retirementPay": "退休人员补充医疗保险支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "disabledPay": "残疾军人医疗补助支付s",
                        "payPerson": "本次个人现金支付金额",
                        "benniandutongchoujijinleijizhifu": "本年度统筹基金累计支付", 
                        "benniandudaehuzhuzijinleijizhifu": "本年度大额互助资金【住院】累计支付",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "payPersonAcount": "本次个人账户支付金额",
                        "sum": "合计金额",
                    }
                }
            },
            // 上海
            '2000': {
                '100': {
                    invoiceMapping: {
                        "department": "就诊科室",
                        "diagnoise": "诊断结论",
                        "diagnoise2": "诊断结论2",
                        "diagnoise3": "诊断结论3",
                        "diagnoise4": "诊断结论4",
                        "diagnoise5": "诊断结论5",
                        "doctor":"医生"
                    }
                },
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "sum": "合计小写",
                        "xianjinzhifu": "现金支付",
                        "payPersonAcount": "个人账户支付",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "selfPayTwo": "分类自负",
                        "zifu": "自负",
                        "selfPayFee": "自费",
                        "printDate": "就诊日期",
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "住院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "xianjinzhifu": "现金支付",
                        "payPersonAcount": "个人账户支付",
                        "sum": "合计小写",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "selfPayTwo": "分类自负",
                        "zifu": "自负",
                        "selfPayFee": "自费",
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                },
                '600': {
                    invoiceMapping: {
                        "department": "就诊科室",
                        "diagnoise": "诊断结论",
                        "diagnoise2": "诊断结论2",
                        "diagnoise3": "诊断结论3",
                        "diagnoise4": "诊断结论4",
                        "diagnoise5": "诊断结论5",
                    }
                },
                '900': {
                    invoiceMapping: {
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "payPersonAcount": "个人账户支付",
                        "zifu": "自负",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "xianjinzhifu": "现金支付",
                        "sum": "合计金额"
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "moneyAmount": "金额",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '910': {
                    invoiceMapping: {
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "payPersonAcount": "个人账户支付",
                        "zifu": "自负",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "xianjinzhifu": "现金支付",
                        "sum": "合计金额"
                    }
                }
            },
            // 其他地区
            '0000': {
                '100': {
                    invoiceMapping: {
                        "department": "就诊科室",
                        "diagnoise": "诊断结论",
                        "diagnoise2": "诊断结论2",
                        "diagnoise3": "诊断结论3",
                        "diagnoise4": "诊断结论4",
                        "diagnoise5": "诊断结论5",
                        "doctor":"医生"
                    }
                },
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "healthcarePay": "医保统筹支付",
                        "qitayibaozhifu":"其他医保支付",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "sum": "合计小写",
                        "printDate": "就诊日期"
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "入院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "sum": "合计小写",
                        "healthcarePay": "医保统筹支付",
                        "qitayibaozhifu":"其他医保支付",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费"
                    },
                    invoiceDetailMapping: {
                        "detailParent": "大项",
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                },
                '600': {
                    invoiceMapping: {
                        "department": "就诊科室",
                        "diagnoise": "诊断结论",
                        "diagnoise2": "诊断结论2",
                        "diagnoise3": "诊断结论3",
                        "diagnoise4": "诊断结论4",
                        "diagnoise5": "诊断结论5",
                    }
                },
                '900': {
                    invoiceMapping: {
                        "healthcarePay": "医保统筹支付",
                        "qitayibaozhifu":"其他医保支付",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "sum": "合计金额",
                    },
                    invoiceDetailMapping: {
                        /*"detailParent": "大项",
                        "item": "名称",
                        "moneyAmount": "金额",
                        "grade": "等级"*/
                        "detailParent": "大项",
                        "item": "名称",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '910': {
                    invoiceMapping: {
                        "healthcarePay": "医保统筹支付",
                        "qitayibaozhifu":"其他医保支付",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "sum": "合计金额",
                    }
                }
            }
        },
        // 万家
        '10006': {
            // 北京
            '1000': {
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "clinicPay": "门诊大额支付",
                        "retirementPay": "退休补充支付",
                        "disabledPay": "残军补助支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "fundPay": "基金支付",
                        "medicareScopeMoney": "本次医保范围内金额",
                        "totalMedRange": "累计医保范围内金额",
                        "yearClinicPay": "年度门诊大额累计支付",
                        "personalMoney": "个人账户余额",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "printDate": "就诊日期",
                        //万家二期新增
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                    },
                    invoiceDetailMapping: {
                        "item": "名称",
                        "type": "名称属性",
                        "spec": "规格",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级",
                        "selfPayRate": "比例"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "入院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "fundPay": "基金支付",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                    },
                    invoiceDetailMapping: {
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                },
                '800': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "printDate": "就诊日期",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "healthcarePay": "统筹基金支付",
                        // "clinicPay": "住院大额支付",
                        "retirementPay": "退休补充支付",
                        "disabledPay": "残军补助支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "fundPay": "基金支付",
                        "daehuzhuzijinzhifu": "住院大额支付",
                        "medicareScopeMoney": "本次医保范围内金额",
                        "benniandutongchoujijinleijizhifu": "年度统筹基金累计支付",
                        "yearClinicPay": "年度门诊大额(住院)累计支付",
                        "personalMoney": "个人账户余额",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "payPersonAcount": "个人账户支付",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                    },
                    invoiceDetailMapping: {
                        "item": "项目名称",
                        "type": "名称属性",
                        "spec": "规格",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级",
                        "selfPayRate": "比例"
                    }
                },
                '900': {
                    invoiceMapping: {
                        "invoiceNo": "NO号",
                        "clinicPay": "门诊大额支付",
                        "retirementPay": "退休补充支付",
                        "disabledPay": "残军补助支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "fundPay": "基金支付",
                        "medicareScopeMoney": "本次医保范围内金额",
                        "medicareScopeAllMoney": "累计医保内范围金额",
                        "yearClinicPay": "年度门诊大额累计支付",
                        "payPersonAcount": "个人账户支付",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写"
                    }
                },
                '910': {
                    invoiceMapping: {
                        "invoiceNo": "NO号",
                        "medicareScopeMoney": "医疗保险范围内金额",
                        "fundPay": "基金支付",
                        "healthcarePay": "统筹基金支付",
                        "daehuzhuzijinzhifu": "大额互助资金（住院）支付",
                        "retirementPay": "退休人员补充医疗保险支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "disabledPay": "残疾军人医疗补助支付",
                        "payPerson": "本次个人现金支付金额",
                        "benniandutongchoujijinleijizhifu": "本年度统筹基金累计支付",
                        "benniandudaehuzhuzijinleijizhifu": "本年度大额互助资金【住院】累计支付",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "sum": "合计小写",
                        "payPersonAcount": "本次个人账户支付金额"
                    }
                }
            },
            // 上海
            '2000': {
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "xianjinzhifu": "现金支付",
                        "payPersonAcount": "个人账户支付",
                        "sum": "合计小写",
                        "printDate": "日期",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "selfPayTwo": "分类自负",
                        "zifu": "自负",
                        "selfPayFee": "自费",
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                    },
                    invoiceDetailMapping: {
                        "grade": "等级",
                        "selfPayRate": "比例",
                        "item": "名称",
                        "spec": "规格",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "住院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "xianjinzhifu": "现金支付",
                        "payPersonAcount": "个人账户支付",
                        "sum": "合计小写",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "selfPayTwo": "分类自负",
                        "zifu": "自负",
                        "selfPayFee": "自费",
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                    },
                    invoiceDetailMapping: {
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                },
                '900': {
                    invoiceMapping: {
                        "invoiceNo": "NO号",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "payPersonAcount": "个人账户支付",
                        "zifu": "自负",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "sum": "合计小写",
                        "xianjinzhifu": "现金支付"
                    }
                },
                '910': {
                    invoiceMapping: {
                        "invoiceNo": "NO号",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "payPersonAcount": "个人账户支付",
                        "zifu": "自负",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "sum": "合计小写",
                        "xianjinzhifu": "现金支付"
                    }
                }
            },
            '0000': {
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "healthcarePay": "统筹基金支付",
                        "qitayibaozhifu": "其他医保支付",
                        "payPerson": "个人支付金额",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "sum": "合计小写",
                        "printDate": "就诊日期",
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                    },
                    invoiceDetailMapping: {
                        "item": "名称",
                        "type": "名称属性",
                        "spec": "规格",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级",
                        "selfPayRate": "比例"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "入院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "healthcarePay": "统筹基金支付",
                        "qitayibaozhifu": "其他医保支付",
                        "payPerson": "个人支付金额",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "sum": "合计小写",
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                    },
                    invoiceDetailMapping: {
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                },
                '900': {
                    invoiceMapping: {
                        "invoiceNo": "NO号",
                        "healthcarePay": "统筹基金支付",
                        "qitayibaozhifu": "其他医保支付",
                        "payPerson": "个人支付金额",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "sum": "合计小写"
                    }

                },
                '910': {
                    invoiceMapping: {
                        "invoiceNo": "NO号",
                        "healthcarePay": "统筹基金支付",
                        "qitayibaozhifu": "其他医保支付",
                        "payPerson": "个人支付金额",
                        "selfPayTwo": "分类自负",
                        "selfPayFee": "自费",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "sum": "合计小写"
                    }
                }
            }
        },
        // 平安生产
        '10007': {
            // 北京
            '0000': {
                '200': {
                    invoiceMapping: {
                        "invoiceNo": "NO号",
                        "applicantCauseCode": "申请原因",
                        "cardId": "社会保障号",
                        "materialType": "材料类型",
                        "therapyType": "治疗类型",
                        "sum": "账单金额",
                        "currencyCode": "币种",
                        "thirdPartyPay": "第三方支付金额",
                        "shiAmt": "社保先期给付",
                        "payPerson": "个人支付金额",
                        "hospitalDiscount": "医院折扣金额",
                        "depName": "科室名称",
                        "depCode": "科室code",
                        "inHospitalDate": "就诊日期",
                        "deadDate": "死亡日期",
                        "icDiseaseDate": "重疾确诊日期",
                        "diseaseDueDate": "残疾鉴定日",
                        "disName": "临床诊断",
                        "disNameBack": "回传疾病",
                        "inHospitalDiagnoseCh": "疾病名称",
                        "inHospitalDiagnose": "疾病代码"
                    },
                    invoiceDetailMapping: {
                        "belongsType": "大项",
                        "type": "费用类型",
                        "itemCode": "编码",
                        "itemType": "选择类型",
                        "item": "名称",
                        "spec": "规格",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "zifei": "自费金额",
                        "fenleizifu": "部分自付",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "invoiceNo": "NO号",
                        "applicantCauseCode": "申请原因",
                        "cardId": "社会保障号",
                        "materialType": "材料类型",
                        "therapyType": "治疗类型",
                        "sum": "账单金额",
                        "currencyCode": "币种",
                        "thirdPartyPay": "第三方支付金额",
                        "shiAmt": "社保先期给付",
                        "payPerson": "个人支付金额",
                        "hospitalDiscount": "医院折扣金额",
                        "depName": "科室名称",
                        "depCode": "科室code",
                        "inHospitalDate": "入院日期",
                        "leaveHospitalDate": "出院日期",
                        "deadDate": "死亡日期",
                        "icDiseaseDate": "重疾确诊日期",
                        "diseaseDueDate": "残疾鉴定日",
                        "disName": "临床诊断",
                        "disNameBack": "回传疾病",
                        "inHospitalDiagnoseCh": "疾病名称",
                        "inHospitalDiagnose": "疾病代码"
                    },
                    invoiceDetailMapping: {
                        "belongsType": "大项",
                        "type": "费用类型",
                        "itemCode": "编码",
                        "itemType": "选择类型",
                        "item": "名称",
                        "spec": "规格",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "zifei": "自费金额",
                        "fenleizifu": "部分自付",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '400': { //住院清单
                    invoiceMapping: {
                        "invoiceNo": "NO号"
                    },
                    invoiceDetailMapping: {
                        "belongsType": "大项",
                        "type": "费用类型",
                        "itemCode": "编码",
                        "itemType": "选择类型",
                        "itemName": "名称",
                        "dosageForm": "规格",
                        "amount": "数量",
                        "price": "单价",
                        "actualPrice": "金额",
                        "egoPrice": "自费金额",
                        "medicareType": "等级",
                        "egoRatio": "自付比例"
                    }
                },
                '410': { //门诊清单
                    invoiceMapping: {
                        "invoiceNo": "NO号"
                    },
                    invoiceDetailMapping: {
                        "belongsType": "大项",
                        "type": "费用类型",
                        "itemCode": "编码",
                        "itemType": "选择类型",
                        "itemName": "名称",
                        "dosageForm": "规格",
                        "amount": "数量",
                        "price": "单价",
                        "actualPrice": "金额",
                        "egoPrice": "自费金额",
                        "medicareType": "等级",
                        "egoRatio": "自付比例"
                    }
                }
            }
        },
        // 平安历史
        '10008': {
            // 北京
            '0000': {
                '200': {
                    invoiceMapping: {
                        "therapyType": "治疗类型",
                        "invoiceNo": "NO号",
                        "disNameBack": "回传疾病",
                        "inHospitalDiagnoseCh": "疾病名称",
                        "inHospitalDiagnose": "疾病代码"
                    },
                    invoiceDetailMapping: {
                        "belongsType": "大项",
                        "type": "费用类型",
                        "itemCode": "编码",
                        "itemType": "选择类型",
                        "item": "名称",
                        "spec": "规格",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "zifei": "自费金额",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "therapyType": "治疗类型",
                        "invoiceNo": "NO号",
                        "disNameBack": "回传疾病",
                        // "leaveHospitalDiagnose": "疾病名称",
                        "inHospitalDiagnoseCh": "疾病名称",
                        "inHospitalDiagnose": "疾病代码"
                    },
                    invoiceDetailMapping: {
                        "belongsType": "大项",
                        "type": "费用类型",
                        "itemCode": "编码",
                        "itemType": "选择类型",
                        "item": "名称",
                        "spec": "规格",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "zifei": "自费金额",
                        "grade": "等级",
                        "selfPayRadio": "自付比例"
                    }
                },
                '400': { //住院清单
                    invoiceMapping: {
                        "therapyType": "治疗类型",
                        "invoiceNo": "NO号",
                        //清单也显示疾病list
                        "disNameBack": "回传疾病",
                        "inHospitalDiagnoseCh": "疾病名称",
                        "inHospitalDiagnose": "疾病代码"
                    },
                    invoiceDetailMapping: {
                        "belongsType": "大项",
                        "type": "费用类型",
                        "itemCode": "编码",
                        "itemType": "选择类型",
                        "itemName": "名称",
                        "dosageForm": "规格",
                        "amount": "数量",
                        "price": "单价",
                        "actualPrice": "金额",
                        "egoPrice": "自费金额",
                        "medicareType": "等级",
                        "egoRatio": "自付比例"
                    }
                },
                '410': { //门诊清单
                    invoiceMapping: {
                        "therapyType": "治疗类型",
                        "invoiceNo": "NO号",
                        //清单也显示疾病list
                        "disNameBack": "回传疾病",
                        "inHospitalDiagnoseCh": "疾病名称",
                        "inHospitalDiagnose": "疾病代码"
                    },
                    invoiceDetailMapping: {
                        "belongsType": "大项",
                        "type": "费用类型",
                        "itemCode": "编码",
                        "itemType": "选择类型",
                        "itemName": "名称",
                        "dosageForm": "规格",
                        "amount": "数量",
                        "price": "单价",
                        "actualPrice": "金额",
                        "egoPrice": "自费金额",
                        "medicareType": "等级",
                        "egoRatio": "自付比例"
                    }
                }
            }
        },
        // 合金在线
        '99999': {
            '1000': {
                '100': {
                    invoiceMapping: {
                        "hospitalName": "医院名称",
                        "department": "就诊科室",
                        "visitDate": "日期",
                        "diagnoise": "诊断结论",
                        "diagnoise2": "诊断结论2",
                        "diagnoise3": "诊断结论3",
                        "diagnoise4": "诊断结论4",
                        "diagnoise5": "诊断结论5"
                    },
                    invoiceDetailMapping: {
                        "drugName": "名称",
                        "drugSpec": "规格",
                        "drugDose": "数量",
                        "drugFrequency": "使用频次",
                        "drugUsageVolume": "每次用量",
                        "drugPrice": "单价",
                        "drugCost": "金额"
                    }
                },
                '200': {
                    invoiceMapping: {
                        "medicalType": "医疗机构类型",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "clinicPay": "门诊大额支付",
                        "retirementPay": "退休补充支付",
                        "disabledPay": "残军补助支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "fundPay": "基金支付",
                        "medicareScopeMoney": "本次医保范围内金额",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "payPerson": "个人支付金额",
                        "sum": "合计小写",
                        "printDate": "就诊日期",
                        "xianjinzhifu": "现金支付",
                        "payPersonAcount": "个人账户支付",
                        "healthcarePay": "医保统筹支付",
                        "additionalPay": "附加支付",
                        "zifu": "自付",
                        "qitayibaozhifu": "其他医保支付",
                        "thirdpartypay": "第三方支付金额",
                        "thirdininsurance": "第三方医保范围内金额",
                        "thirdoutinsurance": "第三方医保范围外金额"
                    },
                    invoiceDetailMapping: {
                        "item": "名称",
                        "spec": "规格",
                        "unit": "单位",
                        "num": "数量",
                        "unitPrice": "单价",
                        "moneyAmount": "金额",
                        "grade": "等级"
                    }
                },
                '300': {
                    invoiceMapping: {
                        "hospitalizedNo": "住院号",
                        "medicalType": "医疗机构类型",
                        "inHospitalDate": "入院日期",
                        "leaveHospitalDate": "出院日期",
                        "inhosdays": "住院天数",
                        "invoiceNo": "NO号",
                        "patientName": "姓名",
                        "gender": "性别",
                        "medicareType": "医保类型",
                        "cardId": "社会保障号码",
                        "medicareScopeMoney": "医疗保险范围内金额",
                        "fundPay": "医疗保险基金支付金额",
                        "healthcarePay": "统筹基金支付",
                        "daehuzhuzijinzhifu": "大额互助资金（住院）支付",
                        "retirementPay": "退休人员补充医疗保险支付",
                        "unitAddPay": "单位补充医疗保险（原公疗）",
                        "disabledPay": "残疾军人医疗补助支付",
                        "payPerson": "个人自付、自费金额",
                        "sum": "合计小写",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "xianjinzhifu": "现金支付",
                        "payPersonAcount": "个人账户支付",
                        "additionalPay": "附加支付",
                        "zifu": "自负",
                        "selfPayFee": "自费金额",
                        "thirdpartypay": "第三方支付金额",
                        "thirdininsurance": "第三方支付单位名称",
                        "qitayibaozhifu": "其他医保支付",
                        "inHospitalDiagnoseCh": "疾病诊断名称",
                        "inHospitalDiagnose": "ICD-10编码",
                        "inHospitalDiagnoseCh2": "疾病诊断名称2",
                        "inHospitalDiagnose2": "ICD-10编码",
                        "inHospitalDiagnoseCh3": "疾病诊断名称3",
                        "inHospitalDiagnose3": "ICD-10编码",
                        "inHospitalDiagnoseCh4": "疾病诊断名称4",
                        "inHospitalDiagnose4": "ICD-10编码",
                        "inHospitalDiagnoseCh5": "疾病诊断名称5",
                        "inHospitalDiagnose5": "ICD-10编码"
                    },
                    invoiceDetailMapping: {
                        "expenseCode": "费用类型",
                        "item": "名称",
                        "moneyAmount": "金额"
                    }
                },
                '400': {
                    invoiceMapping: {
                        "hospitalizedNo": "住院号",
                        "name": "姓名",
                        "gender": "性别",
                        "cardType": "证件类型",
                        "cardId": "证件号码"
                    },
                    invoiceDetailMapping: {
                        "itemCode": "药品代码",
                        "itemName": "药品名称",
                        "specification": "规格",
                        "dosageForm": "剂型",
                        "unit": "单位",
                        "price": "单价",
                        "amount": "数量",
                        "actualPrice": "金额",
                        "medicareType": "医保类型",
                        "egoRatio": "自付比例",
                        "egoPrice": "自付金额"
                    }
                },
                '600': {
                    invoiceMapping: {
                        "inhosdays": "住院天数",
                        "inHospitalDate": "入院日期",
                        "inHospitalDiagnose": "入院诊断",
                        "leaveHospitalDate": "出院日期",
                        "leaveHospitalDiagnose": "出院诊断",
                        "patientName": "姓名",
                        "registeredId": "住院号"
                    }
                },
                '800': {
                    invoiceMapping: {
                        "inhosdays": "住院天数",
                        "inHospitalDate": "入院日期",
                        "inHospitalDiagnose": "入院诊断",
                        "leaveHospitalDate": "出院日期",
                        "leaveHospitalDiagnose": "出院诊断",
                        "patientName": "姓名",
                        "registeredId": "住院号"
                    }
                },
                '900': {
                    invoiceMapping: {
                        "clinicPay": "门诊大额支付",
                        "retirementPay": "退休补充支付",
                        "disabledPay": "残军补助支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "fundPay": "基金支付",
                        "medicareScopeMoney": "本次医保范围内金额",
                        "medicareScopeAllMoney": "累计医保内范围金额",
                        "yearClinicPay": "年度门诊大额累计支付",
                        "payPersonAcount": "个人账户支付",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "payPerson": "个人支付金额"
                    }
                },
                '910': {
                    invoiceMapping: {
                        "healthcarePay": "医保统筹支付",
                        "daehuzhuzijinzhifu": "大额互助资金（住院）支付",
                        "retirementPay": "退休补充支付",
                        "unitAddPay": "单位补充【原公疗】支付",
                        "disabledPay": "残军补助支付",
                        "payPerson": "个人支付金额",
                        "benniandutongchoujijinleijizhifu": "本年度统筹基金累计支付",
                        "benniandudaehuzhuzijinleijizhifu": "本年度大额互助资金【住院】累计支付",
                        "selfPayOne": "自付一",
                        "ownExpense": "起付金额",
                        "cappedMoney": "超封顶金额",
                        "selfPayTwo": "自付二",
                        "selfPayFee": "自费",
                        "payPersonAcount": "个人账户支付"
                    }
                },
                '3000': {
                    invoiceMapping: {
                        "accidentDate": "出险日期",
                        "accidentCode": "出险类型",
                        "name": "被保人姓名",
                        "gender": "性别",
                        "cardType": "证件类型",
                        "cardId": "证件号码",
                        "mobile": "手机",
                        "telephone": "座机",
                        "bankName": "开户行",
                        "bankAccountNo": "银行账号"
                    },
                    invoiceDetailMapping: {
                        "name": "领款人姓名",
                        "gender": "性别",
                        "cardType": "证件类型",
                        "cardId": "证件号码",
                        "mobile": "手机",
                        "telephone": "座机",
                        "bankName": "开户行",
                        "bankAccountNo": "银行账号"
                    }
                }
            }
        }
    }
})(my)
