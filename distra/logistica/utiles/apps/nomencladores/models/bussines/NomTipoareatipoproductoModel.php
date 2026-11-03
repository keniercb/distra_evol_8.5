<?php

class NomTipoareatipoproductoModel extends NomencladoresModel
{
    public function __construct()
    {
        parent::__construct();
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = false)
    {
        $valores = array();
        if ($obj['filtro']) {
            $arr = json_decode(stripslashes($obj['filtro']));
            foreach ($arr as $arrfiltros) {
                foreach ($arrfiltros as $key => $value) {
                    if ($key != 'signo' && $key != 'modelo') {
                        if ($arrfiltros->signo) {
                            $signo = explode(',', $arrfiltros->signo);
                            if (trim($signo[0]) == 'in'
                                || trim($signo[0]) == 'not in'
                            ) {
                                if ($signo[1] == 'select') {
                                    $arrFiltro []
                                        = " m.{$obj['idnom']} " . strtoupper(
                                            $signo[0]
                                        )
                                        . " ( SELECT x.{$obj['idnom']}
                                                FROM {$arrfiltros->modelo} x
                                                WHERE  {$key} = $value )";
                                } else {
                                    $arrFiltro []
                                        = " m.{$obj['idnom']}
                                            {$signo[0]}( $value )";
                                }
                            } else {
                                $signo = ($arrfiltros->signo)
                                    ? $arrfiltros->signo : " = ?";
                                $arrFiltro [] = " $key $signo";
                                $valores [] = $value;
                            }
                        }
                    }
                }
            }
        }
        $serviciosConfiguracionGeneral= ServiciosConfiguracionGeneralHelper::__init();
        $query = new Doctrine_Query();
        $query = $serviciosConfiguracionGeneral->QueryRootNomNaturaleza(
            $query, 'm'
        );


        if ($obj['adicionados']) {
            $query->addWhere(
                "m.{$obj['idnom']} not in ({$obj['adicionados']})"
            );
        }
        if ($obj['eliminados']) {
            $query->addWhere("m.{$obj['idnom']} not in ({$obj['eliminados']})");
        }
        new NomTipoareatipoproducto();

        if ($obj['join']) {
            $query->leftJoin($obj['join']);
        }

        if (is_array($arrFiltro) && count($arrFiltro)) {
            $filtro = implode(' AND ', $arrFiltro);
            $query->addWhere($filtro, $valores);
        }

        if ($obj['filtroOr']) {
            $query->orWhere("m.{$obj['idnom']} in ({$obj['filtroOr']})");
        }

        $arreglo = array('datos'    => $query->offset(
            $obj['start'] ? $obj['start'] : 0
        )->limit($obj['limit'] ? $obj['limit'] : 5)->fetchArray(),
                         'cantidad' => $query->count());
        return $arreglo;
    }

}

