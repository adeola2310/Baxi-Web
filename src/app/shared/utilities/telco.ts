import { TelcoModel } from './TelcoModel';


export const telcos: Array<TelcoModel> = [
    {
        name : 'MTN',
        values : ['0703', '0706', '0803', '0806', '0810', '0813', '0814', '0816', '0903', '0906'],
    },
    {
        name : 'GLO',
        values : ['0705', '0805', '0807', '0811', '0815', '0905'],
    },
    {
        name : 'airtel',
        values : ['0701', '0708', '0802', '0808', '0812', '0902', '0907', '0901'],
    },
    {
        name : '9Mobile',
        values : ['0809', '0817', '0818', '0908', '0909'],
    },
    {
        name : 'smile',
        values : ['0702']
    },
];

export class telco {
    public checknumber() {
        telcos.forEach((tel: TelcoModel) => {
            tel.values.forEach(( value: string) => {
                console.log(value);
            });
        });
    }
}
