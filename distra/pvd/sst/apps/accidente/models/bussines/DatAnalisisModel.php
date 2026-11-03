<?php

class DatAnalisisModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getPrincipalesIndicadores($idestructura, $trimestre)
    {
        $DatAccidente = new DatAccidente();
        $r = $DatAccidente->getdatosAcidente($idestructura, $trimestre, 1, 1);//tipoacc,categoriapersona


        $datos1 = array(
            ['no' => '01', 'indicadores' => 'Trabajadores civiles lesionados por accidente de trabajo', 'um' => 'uno', 'cant' => $r[0]['cant_accidentados'], 'encabezado' => 1, 'agrupador' => 'Trabajadores civiles lesionados por accidente de trabajo', 'orden' => 1],
            ['no' => '01.01', 'indicadores' => 'De ellos fatales', 'um' => 'uno', 'cant' => $r[0]['cant_fallecidos'], 'encabezado' => 0, 'agrupador' => 'Trabajadores civiles lesionados por accidente de trabajo', 'orden' => 1],
            //  ['no' => '01.02', 'indicadores' => 'Hombres/dias perdidos por accidentes de trabajo', 'um' => 'h/d', 'cant' => '', 'encabezado' => 0, 'agrupador' => 'Trabajadores civiles lesionados por accidente de trabajo','orden'=>1],
            ['no' => '01.03', 'indicadores' => 'Subsidio pagado por accidentes de trabajo', 'um' => 'peso', 'cant' => $r[0]['sum_importe_implicados'], 'encabezado' => 0, 'agrupador' => 'Trabajadores civiles lesionados por accidente de trabajo', 'orden' => 1],
            ['no' => '01.04', 'indicadores' => 'Daños materiales por accidentes de trabajo y averías con o son lesiones', 'um' => 'peso', 'cant' => $r[0]['sum_importe_acc_costo'], 'encabezado' => 0, 'agrupador' => 'Trabajadores civiles lesionados por accidente de trabajo', 'orden' => 1],
        );


        $r = $DatAccidente->getdatosAcidente($idestructura, $trimestre, 2, 1);//tipoacc,categoriapersona
        $datos2 = array(['no' => '02', 'indicadores' => 'Trabajadores civiles lesionados por accidentes de trayecto', 'um' => 'uno', 'cant' => $r[0]['cant_accidentados'], 'encabezado' => 1, 'agrupador' => 'Trabajadores civiles lesionados por accidentes de trayecto', 'orden' => 2],
            ['no' => '02.01', 'indicadores' => 'De ellos fatales', 'um' => 'uno', 'cant' => $r[0]['cant_fallecidos'], 'encabezado' => 0, 'agrupador' => 'Trabajadores civiles lesionados por accidentes de trayecto', 'orden' => 2],
            //  ['no' => '02.02', 'indicadores' => 'Hombres/dias perdidos por accidentes de trayecto', 'h/d' => 'uno', 'cant' => '', 'encabezado' => 0, 'agrupador' => 'Trabajadores civiles lesionados por accidentes de trayecto','orden'=>2],
            ['no' => '02.03', 'indicadores' => 'Subsidio pagado por accidentes de trayecto', 'um' => 'peso', 'cant' => $r[0]['sum_importe_implicados'], 'encabezado' => 0, 'agrupador' => 'Trabajadores civiles lesionados por accidentes de trayecto', 'orden' => 2]
        );

        $r = $DatAccidente->getdatosAcidente($idestructura, $trimestre, 3, 1);//tipoacc,categoriapersona
        $datos3 = array(
            ['no' => '03', 'indicadores' => 'Trabajadores civiles lesionados por otros accidentes equiparados', 'um' => 'uno', 'cant' => $r[0]['cant_accidentados'], 'encabezado' => 1, 'agrupador' => 'Trabajadores civiles lesionados por otros accidentes equiparados', 'orden' => 3],
            ['no' => '03.01', 'indicadores' => 'De ellos fatales', 'um' => 'uno', 'cant' => $r[0]['cant_fallecidos'], 'encabezado' => 0, 'agrupador' => 'Trabajadores civiles lesionados por otros accidentes equiparados', 'orden' => 3],
            //   ['no' => '03.02', 'indicadores' => 'Hombres/dias perdidos por otros accidentes equiparados', 'h/d' => 'uno', 'cant' => '', 'encabezado' => 0, 'agrupador' => 'Trabajadores civiles lesionados por otros accidentes equiparados','orden'=>3],
            ['no' => '03.03', 'indicadores' => 'Subsidio pagado por otros accidentes equiparados', 'um' => 'peso', 'cant' => $r[0]['sum_importe_implicados'], 'encabezado' => 0, 'agrupador' => 'Trabajadores civiles lesionados por otros accidentes equiparados', 'orden' => 3]

        );
        $r = $DatAccidente->getdatosAcidente($idestructura, $trimestre, 1, 2);//tipoacc,categoriapersona
        $datos4 = array(
            ['no' => '06', 'indicadores' => 'Personal militar lesionado por accidentes de trabajo', 'um' => 'uno', 'cant' => $r[0]['cant_accidentados'], 'encabezado' => 1, 'agrupador' => 'Personal militar lesionado por accidentes de trabajo', 'orden' => 4],
            ['no' => '06.01', 'indicadores' => 'De ellos fatales', 'um' => 'uno', 'cant' => $r[0]['cant_fallecidos'], 'encabezado' => 0, 'agrupador' => 'Personal militar lesionado por accidentes de trabajo', 'orden' => 4],
            // ['no' => '06.02', 'indicadores' => 'Hombres/dias perdidos del personal militar por accidentes de trabajo', 'um' => 'h/d', 'cant' => '', 'encabezado' => 0, 'agrupador' => 'Personal militar lesionado por accidentes de trabajo','orden'=>4],
            ['no' => '06.03', 'indicadores' => 'Haberes pagados al personal militar por accidentes de trabajo', 'um' => 'peso', 'cant' => $r[0]['sum_importe_implicados'], 'encabezado' => 0, 'agrupador' => 'Personal militar lesionado por accidentes de trabajo', 'orden' => 4]

        );
        //print_r($datos4);die;
        $r = $DatAccidente->getdatosAcidente($idestructura, $trimestre, 2, 2);//tipoacc,categoriapersona
        $datos5 = array(
            ['no' => '07', 'indicadores' => 'Personal militar lesionado por accidentes de trayecto', 'um' => 'uno', 'cant' => $r[0]['cant_accidentados'], 'encabezado' => 1, 'agrupador' => 'Personal militar lesionado por accidentes de trayecto', 'orden' => 5],
            ['no' => '07.01', 'indicadores' => 'De ellos fatales', 'um' => 'uno', 'cant' => $r[0]['cant_fallecidos'], 'encabezado' => 0, 'agrupador' => 'Personal militar lesionado por accidentes de trayecto', 'orden' => 5],
            //  ['no' => '07.02', 'indicadores' => 'Hombres/dias perdidos del personal militar por accidentes de trayecto', 'um' => 'h/d', 'cant' => '', 'encabezado' => 0, 'agrupador' => 'Personal militar lesionado por accidentes de trayecto','orden'=>5],
            ['no' => '07.03', 'indicadores' => 'Haberes pagados al personal militar por accidentes de trayecto', 'um' => 'peso', 'cant' => $r[0]['sum_importe_implicados'], 'encabezado' => 0, 'agrupador' => 'Personal militar lesionado por accidentes de trayecto', 'orden' => 5]
        );
        $r = $DatAccidente->getdatosAcidente($idestructura, $trimestre, 3, 2);//tipoacc,categoriapersona
        $datos6 = array(
            ['no' => '08', 'indicadores' => 'Personal militar lesionado en actividades Puramente militares', 'um' => 'uno', 'cant' => $r[0]['cant_accidentados'], 'encabezado' => 1, 'agrupador' => 'Personal militar lesionado en actividades Puramente militares', 'orden' => 6],
            ['no' => '08.01', 'indicadores' => 'De ellos fatales', 'um' => 'uno', 'cant' => $r[0]['cant_fallecidos'], 'encabezado' => 0, 'agrupador' => 'Personal militar lesionado en actividades Puramente militares', 'orden' => 6],
            //  ['no' => '08.02', 'indicadores' => 'Hombres/dias perdidos del personal militar por accidentes en actividades puramente militares', 'um' => 'h/d', 'cant' => '', 'encabezado' => 0, 'agrupador' => 'Personal militar lesionado en actividades Puramente militares','orden'=>6],
            ['no' => '08.03', 'indicadores' => 'Haberes pagados al personal militar por accidentes en actividades puramente militares', 'um' => 'peso', 'cant' => $r[0]['sum_importe_implicados'], 'encabezado' => 0, 'agrupador' => 'Personal militar lesionado en actividades Puramente militares', 'orden' => 6]
        );


        /*
         // ['no' => '04', 'indicadores' => 'Promedio de trabajdores total', 'um' => 'uno', 'cant' => '', 'encabezado' => 1, 'agrupador' => '04'],
          // ['no' => '05', 'indicadores' => 'Tiempo trabajado', 'um' => 'h/h', 'cant' => '', 'encabezado' => 1, 'agrupador' => '05'],

         */

        $datos = Array();
        $datos = array_merge($datos1, $datos2, $datos3, $datos4, $datos5, $datos6);
        return $datos;
    }

    public function getDatosAccidentes($idestructura)
    {
        $DatAccidentecausa = new DatAccidentecausa();
        $DatAccidente = new DatAccidente();
        $DatAccidenteimplicado = new DatAccidenteimplicado();

        $causas = $DatAccidentecausa->getCantAccidentes($idestructura);
        $partecuerpo = $DatAccidenteimplicado->getCantPartescuerpo($idestructura);
        $tipoacc = $DatAccidente->getCantTipoAccidente($idestructura);
        $tipovalidez = $DatAccidenteimplicado->getCantTipoinvalidez($idestructura);

        foreach ($partecuerpo as $k => $part) {
            $partecuerpo[$k]['padre'] = 'Parte del cuerpo afectada';
        }

        foreach ($tipoacc as $k => $tip) {
            $tipoacc[$k]['padre'] = 'Tipo de accidentes';
        }
        foreach ($tipovalidez as $k => $t) {
            $tipovalidez[$k]['padre'] = 'Clase de incapacidad';
        }

        $result = Array();
        $result = array_merge($causas, $partecuerpo, $tipovalidez, $tipoacc);

        return $result;
    }

    public function getDatosPartesAfectadas($idestructura, $partes, $annoini, $annofin)
    {
        $DatAccidenteimplicado = new DatAccidenteimplicado();
        $datos = $DatAccidenteimplicado->getDatosPartesAfectadas($idestructura, $partes, $annoini, $annofin);
        $result = array();
        if (count($datos) != 0) {
            $rdenompartes = NomPartecuerpo::getDenomPartes($partes);
            $cont = 0;
            foreach ($rdenompartes as $denom) {
                $result[$cont]['Denominación'] = $denom['denominacion'];
                foreach ($datos as $dat) {
                    if ($denom['denominacion'] == $dat['denominacion']) {
                        $result[$cont][$dat['anno']] = $dat['cantidad'];
                    }
                }
                $cont++;
            }
        }

        foreach ($result as $pos => $r) {
            $init = $annoini;
            while ($init <= $annofin) {
                if (!$r[$init]) {
                    $result[$pos][$init] = 0;
                }
                $init++;
            }
        }

        return $result;
    }

    public function getDenomPartesAfectadas($idestructura, $partes)
    {
        $DatAccidenteimplicado = new NomPartecuerpo();
        $partes = $DatAccidenteimplicado->getPartesActivos();
        return $partes;
    }

    public function getPartesAfectadasReporte($idestructura, $partes, $annoini, $annofin)
    {
        $DatAccidenteimplicado = new DatAccidenteimplicado();
        $datos = $DatAccidenteimplicado->getDatosPartesAfectadas($idestructura, $partes, $annoini, $annofin);
        return $datos;
    }

    public function getDatosComportamiento($idestructura, $annoini, $annofin)
    {
        $DatAccidenteimplicado = new DatAccidenteimplicado();
        $comportamiento = $DatAccidenteimplicado->getDatosComportamiento($idestructura, $annoini, $annofin);
        return $comportamiento;
    }

    public function getDatosComportamientoVista($idestructura, $annoini, $annofin)
    {
        $DatAccidenteimplicado = new DatAccidenteimplicado();
        $datos = $DatAccidenteimplicado->getDatosComportamiento($idestructura, $annoini, $annofin);
        $redades = array(
            'menos17' => '- de 17 años',
            'entre1725' => 'De 17 a 25 años',
            'entre2640' => 'De 26 a 40 años',
            'entre4150' => 'De 41 a 50 años',
            'entre5160' => 'De 51 a 60 años',
            'mayor60' => '+ 60 años');
        $result = array();
        $cont = 0;
        foreach ($redades as $i => $e) {
            $result[$cont]['Edad'] = $e;
            foreach ($datos as $d) {
                $result[$cont][$d['anno']] = $d[$i];
            }
            $cont++;
        }
        foreach ($result as $pos => $r) {
            $init = $annoini;
            while ($init <= $annofin) {
                if (!$r[$init]) {
                    $result[$pos][$init] = 0;
                }
                $init++;
            }
        }
        return $result;

    }

    public function getDatosIncapacidadVista($idestructura, $incapacidad, $annoini, $annofin)
    {
        $DatAccidenteimplicado = new DatAccidenteimplicado();
        $datos = $DatAccidenteimplicado->getDatosIncapacidad($idestructura, $incapacidad, $annoini, $annofin);
        $result = array();
        if (count($datos) != 0) {
            $rdenomincapacidad = NomTipoinvalidez::getDenomInvalidez($incapacidad);
            $cont = 0;
            foreach ($rdenomincapacidad as $denom) {
                $result[$cont]['Clase de incapacidad'] = $denom['denominacion'];
                foreach ($datos as $dat) {
                    if ($denom['denominacion'] == $dat['denominacion']) {
                        $result[$cont][$dat['anno']] = $dat['cantidad'];
                    }
                }
                $cont++;
            }
        }

        foreach ($result as $pos => $r) {
            $init = $annoini;
            while ($init <= $annofin) {
                if (!$r[$init]) {
                    $result[$pos][$init] = 0;
                }
                $init++;
            }
        }

        return $result;
    }

    public function getDatosIncapacidad($idestructura, $incapacidad, $annoini, $annofin)
    {
        $DatAccidenteimplicado = new DatAccidenteimplicado();
        $datos = $DatAccidenteimplicado->getDatosIncapacidad($idestructura, $incapacidad, $annoini, $annofin);
        return $datos;
    }

    public function getDatosCantFallecidosVista($idestructura, $accidentes, $annoini, $annofin)
    {
        $DatAccidenteimplicado = new DatAccidenteimplicado();
        $datos = $DatAccidenteimplicado->getDatosCantFallecidos($idestructura, $accidentes, $annoini, $annofin);
        $result = array();
        if (count($datos) != 0) {
            $rdenomincapacidad = NomTipoaccidente::getDenomTipo($accidentes);
            $cont = 0;
            foreach ($rdenomincapacidad as $denom) {
                $result[$cont]['Accidentes del trabajo'] = $denom['denominacion'];
                foreach ($datos as $dat) {
                    if ($denom['denominacion'] == $dat['denominacion']) {
                        $result[$cont][$dat['anno']] = $dat['cantidad'];
                    }
                }
                $cont++;
            }
        }

        foreach ($result as $pos => $r) {
            $init = $annoini;
            while ($init <= $annofin) {
                if (!$r[$init]) {
                    $result[$pos][$init] = 0;
                }
                $init++;
            }
        }

        return $result;
    }

    public function getDatosCantFallecidos($idestructura, $accidentes, $annoini, $annofin)
    {
        $DatAccidenteimplicado = new DatAccidenteimplicado();
        $datos = $DatAccidenteimplicado->getDatosCantFallecidos($idestructura, $accidentes, $annoini, $annofin);
        return $datos;
    }

    public function getCategoriasActivas($categoria)
    {
        $obj = new DatAccidenteimplicado();
        return $obj->getCategoriasActivas($categoria);

    }

    public function getDatosCategoria($idestructura, $categoria, $annoini, $annofin)
    {
        $DatAccidenteimplicado = new DatAccidenteimplicado();
        $datos = $DatAccidenteimplicado->getDatosCategoria($idestructura, $categoria, $annoini, $annofin);
        $result = array();
        if (count($datos) != 0) {
            $rdenomincategoria = $DatAccidenteimplicado->getCategoriasActivas($categoria);
            $cont = 0;
            foreach ($rdenomincategoria as $denom) {
                $result[$cont]['Categoría del personal'] = $denom['denominacion'];
                foreach ($datos as $dat) {
                    if ($denom['denominacion'] == $dat['denominacion']) {
                        $result[$cont][$dat['anno']] = $dat['cantidad'];
                    }
                }
                $cont++;
            }
        }

        foreach ($result as $pos => $r) {
            $init = $annoini;
            while ($init <= $annofin) {
                if (!$r[$init]) {
                    $result[$pos][$init] = 0;
                }
                $init++;
            }
        }
        return $result;
    }

    public function getDatoscategoriaReporte($idestructura, $categoria, $annoini, $annofin)
    {
        $DatAccidenteimplicado = new DatAccidenteimplicado();
        $datos = $DatAccidenteimplicado->getDatosCategoria($idestructura, $categoria, $annoini, $annofin);
        return $datos;

    }
}