<?php

class NomSeriedocumentoModel extends NomencladoresModel
{

    private $serviciosConfiguracionGeneral;

    public function __construct()
    {
        parent::__construct();
        $this->serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = false)
    {
        if ($obj['metodo'] == 'devolverDocs') {
            return $this->devolverDocs();
        } else if ($obj['rngFactManual'] == 1) {
            return $this->getRangosBySerieSeleccionada($obj);
        }
        return $this->buscarAux($obj, $arrIdsInsertados, $returnobj);
    }

    public function buscarAux($obj, $arrIdsInsertados = false, $returnobj = false)
    {
        $valores = array();
        if ($obj['filtro']) {
            $arr = json_decode(stripslashes($obj['filtro']));
            foreach ($arr as $arrfiltros) {
                foreach ($arrfiltros as $key => $value) {
                    if ($key != 'signo' && $key != 'modelo') {
                        if ($arrfiltros->signo) {
                            $signo = explode(',', $arrfiltros->signo);
                            if (trim($signo[0]) == 'in' || trim($signo[0]) == 'not in') {
                                if ($signo[1] == 'select')
                                    $arrFiltro [] = " m.{$obj['idnom']} " .
                                        strtoupper($signo[0])
                                        . " ( SELECT x.{$obj['idnom']} "
                                        . "FROM {$arrfiltros->modelo} x WHERE  {$key} = $value )";
                                else
                                    $arrFiltro [] = " m.{$obj['idnom']} {$signo[0]}( $value )";
                            } else {
                                $signo = ($arrfiltros->signo) ? $arrfiltros->signo : " = ?";
                                $arrFiltro [] = " $key $signo ";
                                $valores [] = $value;
                            }
                        }
                    }
                }
            }
        }
        $query = new Doctrine_Query();
        if ($obj['operacion']) {
            $estrucsubsis[] = $this->serviciosConfiguracionGeneral->EncuentraIdestructurasubsist(13);
            $idestrucsubsis = implode(',', $estrucsubsis);
            $query = $this->serviciosConfiguracionGeneral
                ->QueryRootDatOpercionCont($query, 'm')
                ->addWhere("m.idestructurasubsist in ({$idestrucsubsis})");
        } else {
            $query->select('m.*')->from("{$obj['modelo']} m");
        }
        $clasEntidad = 'Dat' . substr($obj['modelo'], 3) . 'Entidad';
        if (class_exists($clasEntidad)) {
            $query->addSelect(
                    ",e.idestructuracomun as usarentidad,"
                    . " e.idseriedocentidad as idseriedocentidad,"
                    . " ndi.nrodocumentoinicial as nrodocumentoinicial"
                    . "{$obj['select']}")
                ->leftJoin(
                    "m.$clasEntidad e ON m.{$obj['idnom']} = e.{$obj['idnom']} "
                    . "AND e.idestructuracomun = {$this->global->Estructura->idestructura}"
                )
                ->leftJoin("e.DatNumerodocinicial ndi ")
                ->leftJoin("e.DatSeriedocentidadrango sder ");
            $query->addSelect('(SELECT COUNT(nc.idrango) '
                . 'FROM DatNumerocontrol nc '
                . 'WHERE nc.idseriedocentidad = ndi.idseriedocentidad  '
                . 'and nc.nrodocumento = ndi.nrodocumentoinicial '
                . 'and (nc.asignado = 1 OR nc.anulado = 1 ) LIMIT 1) as enuso '
            );
        } else if ($obj['select']) {
            $query->addSelect("{$obj['select']}");
        }
        if ($obj['idestructuracomun']) {
            $query->addWhere("e.idestructuracomun = ?", array($obj['idestructuracomun']));
        }
        if ($obj['estado']) {
            $query->addWhere("m.estado = ?", array($obj['estado']));
        }
        if ($obj['iddoc']) {
            $query->addWhere("m.iddoc = ?", array($obj['iddoc']));
        }
        if ($obj['denominacion']) {
            $arrFiltro [] = "denominacion ILIKE '%{$obj['denominacion']}%'";
        }
        if ($obj['adicionados']) {
            $query->addWhere("m.{$obj['idnom']} not in ({$obj['adicionados']})");
        }
        if ($obj['eliminados']) {
            $query->addWhere("m.{$obj['idnom']} not in ({$obj['eliminados']})");
        }
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
        if ($obj['idnom']) {
            $query->orderBy($obj['idnom']);
        }
        $arrSerie = $query
            ->offset($obj['start'] ? $obj['start'] : 0)
            ->limit($obj['limit'] ? $obj['limit'] : 30
            )
            ->fetchArray();
        $nomSerieFact = $this->loadTypeFactura($arrSerie);
        $arreglo = array(
            'cantidad' => $query->count(),
            'datos' => $nomSerieFact
        );
        if ($obj['rangos'] == 1) {
            foreach ($arreglo['datos'] as $i => $dat) {
                if ($dat['idseriedocentidad']) {
                    $query = new Doctrine_Query();
                    $query->select(
                        'dr.idrango, '
                        . 'dr.idestructuracomun, '
                        . 'dr.nrocontrolinicial, '
                        . 'dr.nrocontrolfinal, '
                        . 'dr.activo, '
                        . 'drd.nrodocumentoinicial as nrodocumentoinicial , '
                        . 'drd.nrodocumentofinal as nrodocumentofinal'
                    );
                    $query->addSelect(
                        " ( CAST( CAST( REPLACE( dr.nrocontrolfinal, '-','') as decimal(15,0) ) as int ) "
                        . "- CAST( CAST( REPLACE( dr.nrocontrolinicial, '-','') as decimal(15,0) ) as int ) + 1) "
                        . "AS total "
                    );
                    $result = $query->addSelect(
                            '(SELECT COUNT(nc.idrango) '
                            . 'FROM DatNumerocontrol nc '
                            . 'WHERE nc.idrango = dr.idrango  '
                            . 'and (nc.asignado = 1 OR nc.anulado = 1 ) ) as rangoenuso '
                        )
                        ->from('DatRangonumerocontrol dr')
                        ->innerJoin('dr.DatSeriedocentidadrango dser')
                        ->leftJoin("dr.DatRangonumerodocumento drd ")
                        ->where(" dser.idseriedocentidad = ? ", array($dat['idseriedocentidad']))
                        ->fetchArray();
                    $arreglo['datos'][$i]['datosRango'] = $result;
                }
            }
        }
        return $arreglo;
    }

    public function loadTypeFactura($array)
    {
        $nomFacturas = $this->devolverDocs();
        foreach ($array as &$value) {
            foreach ($nomFacturas['datos'] as $tipofactura) {
                if ($value['iddoc'] == $tipofactura->iddocumentos) {
                    $value['tipodoc'] = $tipofactura->denominacion;
                }
            }
        }
        return $array;
    }

    public function getRangosBySerieSeleccionada($params)
    {
        $query = Doctrine_Query::create()
            ->select(
                'drnc.*, drnd.nrodocumentoinicial as nrodocumentoinicial,
                 drnd.nrodocumentofinal as nrodocumentofinal,'
                . '(SELECT COUNT(*) '
                . 'FROM DatNumerocontrol '
                . 'WHERE asignado = 1 '
                . 'OR anulado = 1 '
                . 'AND drnc.idrango = idrango) as rangoenuso'
            )
            ->from('DatRangonumerocontrol drnc')
            ->innerJoin('drnc.DatSeriedocentidadrango dsr')
            ->leftJoin('drnc.DatRangonumerodocumento drnd')
            ->leftJoin('drnc.DatNumerocontrol dnc')
            ->where(
                'drnc.idestructuracomun = ?',
                array(
                $this->global->Estructura->idestructura
                )
            )
            ->groupBy('drnc.idrango, drnd.idrango');
        if ($params['idseriedocentidad']) {
            $query->addWhere('dsr.idseriedocentidad = ?', array($params['idseriedocentidad']));
            return array(
                'datos' => $query->fetchArray(),
                'cantidad' => $query->count()
            );
        }
        return array(
            'datos' => [],
            'cantidad' => 0
        );
    }

    public function insertarNomenclador($array)
    {
        if ($array['manual'] == 'on') {
            $array['manual'] = 1;
        }
        $obj = parent::insertarNomenclador($array, true);
        if (is_object($obj)) {
            $obj->save();
            return true;
        }
        return false;
    }

    public function modificarNomenclador($array)
    {
        if ($array['manual'] == 'on') {
            $array['manual'] = 1;
        }
        $obj = parent::modificarNomenclador($array, true);
        $obj->save();
        return true;
    }

    public function habilitarDesabiltarEntidad($array)
    {
        return parent::habilitarDesabiltarEntidad($array);
    }

    public function devolverDocs()
    {
        $result['datos'] = $this->serviciosConfiguracionGeneral->DocumentosPorSubsistemaEntidad(
            13, $this->global->Estructura->idestructura
        );
        return $result;
    }

}
