const { ObjectId } = require('mongodb');

console.log(new ObjectId());

console.log(new Date().toISOString());

const RewardOptions = [
	{
		_id: {
			$oid: '6876ab18da1ff5b2156dbbd0',
		},
		titulo: 'VALE MANUTENÇÃO (ATÉ 10 PLACAS)',
		descricao: 'Resgate um Vale Manutenção (Até 10 Placas)',
		chamada: 'Resgate um Vale Manutenção (Até 10 Placas)',
		creditosNecessarios: 750,
		autor: {
			id: '64dd36febf09590b5622f6f9',
			nome: 'Lucas Fernandes',
			avatarUrl: 'https://lh3.googleusercontent.com/a/ACg8ocKt6IpBLQV8bQ3SYImwobZwmYuRm1SSK9KjHgDMzEoOXKgeoRE=s96-c',
		},
		dataInsercao: '2025-08-18T17:01:17.266Z',
	},
	{
		_id: {
			$oid: '6876ab7e7c0b56933abb80d4',
		},
		titulo: 'VALE MANUTENÇÃO (ATÉ 20 PLACAS)',
		descricao: 'Resgate um Vale Manutenção (Até 20 Placas)',
		chamada: 'Resgate um Vale Manutenção (Até 20 Placas)',
		creditosNecessarios: 900,
		autor: {
			id: '64dd36febf09590b5622f6f9',
			nome: 'Lucas Fernandes',
			avatarUrl: 'https://lh3.googleusercontent.com/a/ACg8ocKt6IpBLQV8bQ3SYImwobZwmYuRm1SSK9KjHgDMzEoOXKgeoRE=s96-c',
		},
		dataInsercao: '2025-08-18T17:01:17.266Z',
	},
	{
		_id: {
			$oid: '6876aba9224ce61a8a35400c',
		},
		titulo: 'VALE MANUTENÇÃO (ATÉ 50 PLACAS)',
		descricao: 'Resgate um Vale Manutenção (Até 50 Placas)',
		chamada: 'Resgate um Vale Manutenção (Até 50 Placas)',
		creditosNecessarios: 1800,
		autor: {
			id: '64dd36febf09590b5622f6f9',
			nome: 'Lucas Fernandes',
			avatarUrl: 'https://lh3.googleusercontent.com/a/ACg8ocKt6IpBLQV8bQ3SYImwobZwmYuRm1SSK9KjHgDMzEoOXKgeoRE=s96-c',
		},
		dataInsercao: '2025-08-18T17:01:17.266Z',
	},
];
console.log(JSON.stringify(RewardOptions, null, 2));
