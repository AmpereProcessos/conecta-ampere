'use client';
import { ChartArea, Code, Share2, TicketCheck, Trophy, UserRound } from 'lucide-react';
import { FaSolarPanel } from 'react-icons/fa';
import { Area, Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from 'recharts';
import type { TGetProgramStatsRouteOutput } from '@/app/api/admin/stats/route';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatDateForInput, formatDateInputChange } from '@/lib/methods/formatting';
import { useProgramStatsQuery } from '@/lib/queries/admin/stats';
import { cn } from '@/lib/utils';
import DateInput from '../inputs/DateInput';

export default function AdminProgramStats() {
	const { data, queryParams, updateQueryParams } = useProgramStatsQuery({});

	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-card p-3.5 shadow-sm">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<ChartArea className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">ESTÁTISTICAS DO PROGRAMA</h1>
				</div>
			</div>
			<div className="flex w-full grow flex-col items-center justify-center gap-3 px-0 py-3 lg:px-6">
				<div className="flex w-full flex-col gap-3">
					<div className="flex w-full flex-col gap-1">
						<h1 className="font-bold text-xs leading-none tracking-tight lg:text-sm">DADOS GERAIS DO PROGRAMA</h1>
						<p className="text-[0.625rem] lg:text-xs">Aqui você pode ver as estatísticas gerais do programa, como o total de participantes e o total de indicações.</p>
					</div>
					<div className="flex w-full flex-col items-center gap-1.5 lg:flex-row">
						<div className={cn('flex w-full flex-col gap-1.5 rounded border-2 border-primary bg-primary/30 px-2 py-1.5 lg:w-1/3')}>
							<div className="flex w-full items-center justify-center">
								<UserRound className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
							</div>
							<h1 className="w-full text-center text-[0.6rem] lg:text-base">{data?.totalParticipants || 0} PARTICIPANTES</h1>
						</div>
						<div className={cn('flex w-full flex-col gap-1.5 rounded border-2 border-blue-600 bg-blue-600/30 px-2 py-1.5 lg:w-1/3')}>
							<div className="flex w-full items-center justify-center">
								<Share2 className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
							</div>
							<h1 className="w-full text-center text-[0.6rem] lg:text-base">{data?.totalIndications || 0} INDICAÇÕES</h1>
						</div>
						<div className={cn('flex w-full flex-col gap-1.5 rounded border-2 border-green-500 bg-green-500/30 px-2 py-1.5 lg:w-1/3')}>
							<div className="flex w-full items-center justify-center">
								<Trophy className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
							</div>
							<h1 className="w-full text-center text-[0.6rem] lg:text-base">{data?.totalIndicationsWon || 0} INDICAÇÕES GANHAS</h1>
						</div>
					</div>
				</div>
				<div className="flex w-full items-center justify-center gap-1.5">
					<div className="w-full lg:w-1/2">
						<DateInput
							handleChange={(v) => updateQueryParams({ after: formatDateInputChange(v, 'string', 'start') as string })}
							labelText="DATA DE INÍCIO"
							value={formatDateForInput(queryParams.after)}
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<DateInput
							handleChange={(v) => updateQueryParams({ before: formatDateInputChange(v, 'string', 'end') as string })}
							labelText="DATA DE FIM"
							value={formatDateForInput(queryParams.before)}
						/>
					</div>
				</div>
				<div className="flex w-full flex-col gap-3">
					<div className="flex w-full flex-col gap-1">
						<h1 className="font-bold text-xs leading-none tracking-tight lg:text-sm">DADOS NO PERÍODO</h1>
						<p className="text-[0.625rem] lg:text-xs">Aqui você pode ver as estatísticas do programa no período selecionado.</p>
					</div>
					<div className="flex w-full flex-col items-center gap-1.5 lg:flex-row">
						<div className={cn('flex w-full flex-col gap-1.5 rounded border-2 border-primary bg-primary/30 px-2 py-1.5 lg:w-1/3')}>
							<div className="flex w-full items-center justify-center">
								<UserRound className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
							</div>
							<h1 className="w-full text-center text-[0.6rem] lg:text-base">{data?.totalParticipantsInPeriod || 0} PARTICIPANTES</h1>
						</div>
						<div className={cn('flex w-full flex-col gap-1.5 rounded border-2 border-blue-600 bg-blue-600/30 px-2 py-1.5 lg:w-1/3')}>
							<div className="flex w-full items-center justify-center">
								<Share2 className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
							</div>
							<h1 className="w-full text-center text-[0.6rem] lg:text-base">{data?.totalIndicationsInPeriod || 0} INDICAÇÕES</h1>
						</div>
						<div className={cn('flex w-full flex-col gap-1.5 rounded border-2 border-green-500 bg-green-500/30 px-2 py-1.5 lg:w-1/3')}>
							<div className="flex w-full items-center justify-center">
								<Trophy className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
							</div>
							<h1 className="w-full text-center text-[0.6rem] lg:text-base">{data?.totalIndicationsWonInPeriod || 0} INDICAÇÕES GANHAS</h1>
						</div>
					</div>
					<div className={cn('flex w-full flex-col gap-1.5 rounded border-2 border-[#FB2E9F] bg-[#FB2E9F]/20 px-2 py-1.5 text-[#FB2E9F]')}>
						<div className="flex w-full items-center justify-center">
							<TicketCheck className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
						</div>
						<h1 className="w-full text-center text-[0.6rem] lg:text-base">{data?.totalCreditRedemptionRequestsInPeriod || 0} RESGATES</h1>
					</div>
				</div>
				<AdminProgramStatsGraph graphData={data?.indicationsGraphData || []} />

				<div className={cn('flex w-full flex-col gap-1.5 rounded border-2 border-secondary bg-secondary px-2 py-1.5')}>
					<div className="flex w-full items-center gap-1.5">
						<FaSolarPanel className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
						<h1 className="text-center text-[0.6rem] lg:text-base">INDICAÇÕES POR TIPO DE OPORTUNIDADE</h1>
					</div>
					<div className="flex w-full flex-col gap-1.5">
						{data?.totalIndicationsByTypeInPeriod.map((item, index) => (
							<div className="flex w-full items-center justify-between gap-1.5" key={item.type}>
								<div className="flex items-center gap-1.5">
									<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-[0.55rem] text-primary-foreground ring-primary-foreground">
										#{index + 1}
									</div>
									<h1 className="text-center text-[0.6rem] lg:text-base">{item.type}</h1>
								</div>
								<div className="flex items-center gap-1.5">
									<div className="flex items-center gap-1.5">
										<Share2 className="h-4 min-h-4 w-4 min-w-4" />
										<h1 className="text-center text-[0.6rem] lg:text-base">{item.totalIndications}</h1>
									</div>
									<div className="flex items-center gap-1.5">
										<Trophy className="h-4 min-h-4 w-4 min-w-4" />
										<h1 className="text-center text-[0.6rem] lg:text-base">{item.totalIndicationsWon}</h1>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className={cn('flex w-full flex-col gap-1.5 rounded border-2 border-secondary bg-secondary px-2 py-1.5')}>
					<div className="flex w-full items-center gap-1.5">
						<Code className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
						<h1 className="text-center text-[0.6rem] lg:text-base">INDICAÇÕES POR CÓDIGO DE VENDEDOR</h1>
					</div>
					<div className="flex w-full flex-col gap-1.5">
						{data?.totalIndicationsBySellerCodeInPeriod.map((item, index) => (
							<div className="flex w-full items-center justify-between gap-1.5" key={item.code}>
								<div className="flex items-center gap-1.5">
									<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-[0.55rem] text-primary-foreground ring-primary-foreground">
										#{index + 1}
									</div>
									<h1 className="text-center text-[0.6rem] lg:text-base">{item.code}</h1>
								</div>
								<div className="flex items-center gap-1.5">
									<div className="flex items-center gap-1.5">
										<Share2 className="h-4 min-h-4 w-4 min-w-4" />
										<h1 className="text-center text-[0.6rem] lg:text-base">{item.totalIndications}</h1>
									</div>
									<div className="flex items-center gap-1.5">
										<Trophy className="h-4 min-h-4 w-4 min-w-4" />
										<h1 className="text-center text-[0.6rem] lg:text-base">{item.totalIndicationsWon}</h1>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className={cn('flex w-full flex-col gap-1.5 rounded border-2 border-secondary bg-secondary px-2 py-1.5')}>
					<div className="flex w-full items-center gap-1.5">
						<UserRound className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
						<h1 className="text-center text-[0.6rem] lg:text-base">TOP 10 INDICADORES</h1>
					</div>
					<div className="flex w-full flex-col gap-1.5">
						{data?.totalIndicationsByAuthorInPeriod.map((item, index) => (
							<div className="flex w-full items-center justify-between gap-1.5" key={item.author?._id.toString() || index}>
								<div className="flex items-center gap-1.5">
									<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-[0.55rem] text-primary-foreground ring-primary-foreground">
										#{index + 1}
									</div>
									<h1 className="text-center text-[0.6rem] uppercase lg:text-base">{item.author?.nome || 'N/A'}</h1>
								</div>
								<div className="flex items-center gap-1.5">
									<div className="flex items-center gap-1.5">
										<Share2 className="h-4 min-h-4 w-4 min-w-4" />
										<h1 className="text-center text-[0.6rem] lg:text-base">{item.totalIndications || 0}</h1>
									</div>
									<div className="flex items-center gap-1.5">
										<Trophy className="h-4 min-h-4 w-4 min-w-4" />
										<h1 className="text-center text-[0.6rem] lg:text-base">{item.totalIndicationsWon || 0}</h1>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className={cn('flex w-full flex-col gap-1.5 rounded border-2 border-secondary bg-secondary px-2 py-1.5')}>
					<div className="flex w-full items-center gap-1.5">
						<TicketCheck className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
						<h1 className="text-center text-[0.6rem] lg:text-base">RESGATES POR TIPO DE RECOMPENSA</h1>
					</div>
					<div className="flex w-full flex-col gap-1.5">
						{data?.creditRedemptionRequestsInPeriodByType.map((item, index) => (
							<div className="flex w-full items-center justify-between gap-1.5" key={item.type}>
								<div className="flex items-center gap-1.5">
									<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-[0.55rem] text-primary-foreground ring-primary-foreground">
										#{index + 1}
									</div>
									<h1 className="text-center text-[0.6rem] uppercase lg:text-base">{item.type}</h1>
								</div>
								<div className="flex items-center gap-1.5">
									<div className="flex items-center gap-1.5">
										<TicketCheck className="h-4 min-h-4 w-4 min-w-4" />
										<h1 className="text-center text-[0.6rem] lg:text-base">{item.totalCreditRedemptionRequests || 0}</h1>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

type AdminProgramStatsGraphProps = {
	graphData: TGetProgramStatsRouteOutput['data']['indicationsGraphData'];
};
function AdminProgramStatsGraph({ graphData }: AdminProgramStatsGraphProps) {
	const chartConfig = {
		key: {
			label: 'Data',
		},

		indications: {
			label: 'Quantidade de Indicações',
			color: '#2563eb', // blue hex =
		},
		indicationsWon: {
			label: 'Quantidade de Indicações Ganhas',
			color: '#22c55e',
		},
	};
	return (
		<div className={cn('flex w-full flex-col gap-1.5 rounded border-2 border-secondary bg-secondary px-2 py-1.5')}>
			<div className="flex w-full items-center gap-1.5">
				<Share2 className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
				<h1 className="text-center text-[0.6rem] lg:text-base">GRÁFICO DE INDICAÇÕES</h1>
			</div>
			<div className="flex max-h-[300px] min-h-[300px] w-full items-center justify-center lg:max-h-[250px] lg:min-h-[250px]">
				<ChartContainer className="aspect-auto h-[250px] w-full lg:h-[250px]" config={chartConfig}>
					<ComposedChart
						data={graphData || []}
						margin={{
							top: 5,
							bottom: 5,
							right: 5,
							left: 5,
						}}
					>
						<defs>
							<linearGradient id="fillSecondSoldValue" x1="0" x2="0" y1="0" y2="1">
								<stop offset="30%" stopColor={chartConfig.indications.color} stopOpacity={0.7} />
								<stop offset="70%" stopColor={chartConfig.indications.color} stopOpacity={0.1} />
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							angle={-15}
							axisLine={false}
							dataKey="key"
							interval="preserveStartEnd"
							minTickGap={32}
							textAnchor="end"
							// tickFormatter={(value) => formatDateAsLocale(value) || ''} // Mostra primeiro e último valor
							tickLine={false} // Rotaciona os labels para melhor legibilidade
							tickMargin={8} // Alinhamento do texto
						/>
						{/* YAxis para valor vendido (área) */}
						<YAxis orientation="left" stroke={chartConfig.indications.color} />

						{/* YAxis para quantidade de vendas (barras) */}

						<ChartTooltip
							content={
								<ChartTooltipContent
									indicator="dot"
									labelFormatter={(value) => {
										return value;
									}}
								/>
							}
							cursor={false}
						/>

						<Bar barSize={20} dataKey="indicationsWon" fill={chartConfig.indicationsWon.color} name={chartConfig.indicationsWon.label} radius={4} />

						<Area
							dataKey="indications" // Alterado para left
							fill="url(#fillSecondSoldValue)"
							stackId="a"
							stroke={chartConfig.indications.color}
							type="monotone"
						/>

						<ChartLegend content={<ChartLegendContent />} />
					</ComposedChart>
				</ChartContainer>
			</div>
		</div>
	);
}
