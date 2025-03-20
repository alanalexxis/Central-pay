'use client';

import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import {
  CalendarIcon,
  CreditCard,
  Users,
  DollarSign,
  Loader2
} from 'lucide-react';

import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { ChartContainer } from '@/components/ui/chart';
import { useProfileStore } from '@/store/image-store';
import { formatToMexicoCity } from '@/lib/format';
import { useSession } from 'next-auth/react';

interface Alumno {
  id: number;
  nombre: string;
}

interface Pago {
  idpago: number;
  fecha_pago: string;
  alumno: Alumno;
}

export default function DashboardPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alumnosResponse, pagosResponse] = await Promise.all([
          fetch('/api/alumnos'),
          fetch('/api/pagos')
        ]);
        const alumnosData = await alumnosResponse.json();
        const pagosData = await pagosResponse.json();
        setAlumnos(alumnosData);
        setPagos(pagosData);

        // Process chart data
        const pagosPorMes = processPayments(pagosData);
        setChartData(pagosPorMes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalAlumnos = alumnos.length;
  const totalPagos = pagos.length;
  const { data: session } = useSession();
  const currentMonth = new Date().getMonth();
  const { name } = useProfileStore();
  const firstName = (name || session.user?.name)?.split(' ')[0] || 'Usuario';
  const ingresosTotales = pagos.reduce((total, pago) => {
    return total + (pago.tipo_pago === 'Inscripción' ? 450 : 250);
  }, 0);

  const pagosMesActual = pagos
    .filter((pago) => new Date(pago.fecha_pago).getMonth() === currentMonth)
    .reduce((total, pago) => {
      return total + (pago.tipo_pago === 'Inscripción' ? 450 : 250);
    }, 0);
  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-8'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='text-4xl font-bold tracking-tight'>
            Bienvenido al dashboard, {firstName} 👋
          </h1>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            title={<span className='text-lg font-bold'>Total de alumnos</span>}
            value={totalAlumnos}
            description='Alumnos registrados'
            icon={<Users className='h-4 w-4 text-primary' />}
          />
          <StatCard
            title={<span className='text-lg font-bold'>Pagos este mes</span>}
            value={
              pagos.filter(
                (pago) => new Date(pago.fecha_pago).getMonth() === currentMonth
              ).length
            }
            description={`$${pagosMesActual.toLocaleString()} ingresados este mes`}
            icon={<CalendarIcon className='h-4 w-4 text-primary' />}
          />

          <StatCard
            title={<span className='text-lg font-bold'>Total de pagos</span>}
            value={totalPagos}
            description='Pagos realizados'
            icon={<CreditCard className='h-4 w-4 text-primary' />}
          />
          <StatCard
            title={<span className='text-lg font-bold'>Ingresos totales</span>}
            value={`$${ingresosTotales.toLocaleString()}`}
            description='Desde el inicio de operaciones'
            icon={<DollarSign className='h-4 w-4 text-primary' />}
          />
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-7'>
          <Card className='col-span-4 transition-all hover:shadow-lg'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold'>
                Resumen de ingresos
              </CardTitle>
            </CardHeader>
            <CardContent className='pl-2'>
              <ChartContainer config={{}} className='min-h-[350px] w-full'>
                <ResponsiveContainer width='100%' height={350}>
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey='name'
                      stroke='#888888'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke='#888888'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      content={({ label, payload }) => {
                        if (!payload || payload.length === 0) return null;

                        const total = payload.reduce(
                          (acc, item) => acc + (item.value || 0),
                          0
                        );

                        return (
                          <div className='rounded-md border border-gray-300 bg-white p-2 shadow-md'>
                            <p className='font-bold text-primary'>
                              Total: ${total.toLocaleString()}
                            </p>
                            {payload.map((entry, index) => (
                              <p
                                key={index}
                                className={`text-sm font-medium`}
                                style={{
                                  color:
                                    entry.name === 'Inscripciones'
                                      ? '#dc2626'
                                      : '#2563eb'
                                }} // Rojo para Inscripciones, Azul para Colegiaturas
                              >
                                {entry.name}: ${entry.value?.toLocaleString()}
                              </p>
                            ))}
                          </div>
                        );
                      }}
                    />

                    <Bar
                      dataKey='inscripciones'
                      fill='#f87171'
                      radius={[4, 4, 0, 0]}
                      name='Inscripciones'
                    />
                    <Bar
                      dataKey='colegiaturas'
                      fill='#3b82f6'
                      radius={[4, 4, 0, 0]}
                      name='Colegiaturas'
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className='col-span-3 transition-all hover:shadow-lg'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold'>
                Pagos recientes
              </CardTitle>
              <CardDescription>Últimos 10 pagos realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='font-semibold'>Alumno</TableHead>
                    <TableHead className='font-semibold'>Fecha</TableHead>
                    <TableHead className='font-semibold'>Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagos.slice(0, 10).map((pago) => (
                    <TableRow key={pago.idpago} className='hover:bg-muted/50'>
                      <TableCell className='font-medium'>
                        {pago.alumno.nombre}
                      </TableCell>
                      <TableCell>
                        {formatToMexicoCity(pago.fecha_pago)}
                      </TableCell>
                      <TableCell className='text-primary'>
                        ${pago.tipo_pago === 'Inscripción' ? 450 : 250}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function StatCard({ title, value, description, icon }) {
  return (
    <Card className='transition-all hover:shadow-lg'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-3xl font-bold text-primary'>{value}</div>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
}

function processPayments(pagos: Pago[]) {
  const monthNames = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic'
  ];

  const pagosPorMes = pagos.reduce(
    (acc, pago) => {
      const date = new Date(pago.fecha_pago);
      const mexicoCityDate = new Date(
        date.toLocaleString('en-US', { timeZone: 'America/Mexico_City' })
      );
      const month = mexicoCityDate.getMonth();

      if (!acc[month]) {
        acc[month] = { inscripciones: 0, colegiaturas: 0 };
      }

      if (pago.tipo_pago === 'Inscripción') {
        acc[month].inscripciones += 450;
      } else {
        acc[month].colegiaturas += 250;
      }

      return acc;
    },
    {} as Record<number, { inscripciones: number; colegiaturas: number }>
  );

  return monthNames.map((name, index) => ({
    name,
    inscripciones: pagosPorMes[index]?.inscripciones || 0,
    colegiaturas: pagosPorMes[index]?.colegiaturas || 0
  }));
}
