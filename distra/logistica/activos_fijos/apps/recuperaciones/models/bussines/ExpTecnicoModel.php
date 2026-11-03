<?php

class ExpTecnicoModel extends ZendExt_Model
{

    protected $serviciosCfg, $serviciosSeg;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->serviciosCfg = ServiciosConfiguracionGeneralHelper::__init();
        $this->serviciosSeg = ServiciosSeguridadHelper::__init();
    }

    public function listadoDocumentos($parametros)
    {
        $objMovService = new MovimientoService();
        $datos = $objMovService->getMovimientosDocRegNum($parametros, true);
        return $datos;
    }

    public function obtenerModulos($parametros)
    {
        $sRegNumActivo = new RegNumActivoService();
        $datos = $sRegNumActivo->getMediosDisponibles($parametros, false);

        for ($i = 0; $i < count($datos['datos']); $i++) {
            $datos['datos'][$i]['_id'] = $datos['datos'][$i]['idregnumerico'];
            $datos['datos'][$i]['_is_leaf'] = ($datos['datos'][$i]['esmodulo'] == 1) ? true : false;
            $idreg = $datos['datos'][$i]['idregnumerico'];
            $idpadremodulo = $datos['datos'][$i]['idpadremodulo'];
            $datos['datos'][$i]['_parent'] = ($idreg == $idpadremodulo) ? null : $datos['datos'][$i]['idpadremodulo'];
            if ($datos['datos'][$i]['text'] == null) {
                $datos['datos'][$i]['text'] = $datos['datos'][$i]['DatProductoLogistica']['denominacion'];
            }
        }
        return $datos;
    }

    public function mostrarDetalles($parametros)
    {
        $query = new Doctrine_Query();
        $query->from('DatRegnumerico reg')->innerJoin(
            'reg.DatProductoLogistica pro'
        )->where(
            "reg.idregnumerico = ?", array($parametros['idregnumerico'])
        );
        $query = $this->serviciosCfg->dameQueryJoinNomIndicadores(
            $query, 'pro', 'i', 'ih', 'innerJoin', array(), 0, true, true, true
        );
        $resp = $query->fetchArray();
        $marcamodelo = str_replace(' ', '', $resp[0]['descripcionmarcamodelo']);
        $marcamodelo = str_split(
            str_replace('-', '', $marcamodelo), strrpos($marcamodelo, '-')
        );

        $datos = array('idactivofijo' => $parametros['idregnumerico'],
            'idprod' => $resp[0]['idprod'],
            'arridtablasgenerales' => $resp[0]['arridtablasgenerales'],
            'idindicador' => $resp[0]['idprod'],
            'idtabla' => $resp[0]['idtabla'],
            'idtablageneral' => $resp[0]['idtablageneral'],
            'codigo' => $resp[0]['codigo'], 'titulo' =>
            $resp[0]['denominacion'] . ' '
            . $resp[0]['descripcionmarcamodelo'],
            'nombrepais' => $resp[0]['descripcionnacionalidad'],
            'marca' => $marcamodelo[0], 'modelo' => $marcamodelo[1],
            'denominacion' => $resp[0]['denominacion']);
        return $datos;
    }

    public function getFiltros($parametros, $filtro)
    {

        if ($parametros['denominacion']) {
            $filtro .= " and (i.denominacion iLike '%{$parametros['denominacion']}%'
            or pm.denominacion iLike '%{$parametros['denominacion']}%')";
        }
        if ($parametros['nroserie']) {
            $filtro .= " and (rn.nroserie iLike '%{$parametros['nroserie']}%')";
        }
        if ($parametros['nroinventario']) {
            $filtro .= " and (mrna.nroinventario iLike '%{$parametros['nroinventario']}%'
            or rna.nroinventario iLike '%{$parametros['nroinventario']}%')";
        }
        if ($parametros['idusuario']) {
            $filtro .= " and (mt.idusuario = {$parametros['idusuario']})";
        }
        if ($parametros['fechainicio'] && $parametros['fechafin']) {
            $filtro .= " and ( mt.fecha BETWEEN '{$parametros['fechainicio']}' and '{$parametros['fechafin']}')";
        }
        return $filtro;
    }

    public function mostrarHistorial($parametros)
    {
        $filtro = self::getFiltros($parametros, $filtro);
        if ($parametros['idregnumerico']) {
            $idregnumerico = $parametros['idregnumerico'];
        }

        $filtro = "";
        if ($parametros['fechainicio']) {
            $filtro .= " and ( mt.fecha > '{$parametros['fechainicio']}')";
        } else {
            if ($parametros['fechafin']) {
                $filtro .= " and ( mt.fecha < '{$parametros['fechafin']}')";
            }
        }


        if ($parametros['tipo']) {
            if ($parametros['tipo'] == 'Fisico') {
                $filtro .= " and (mrna.idmovregnumerico is not null)";
            } else {
                if ($parametros['tipo'] == 'Abstracto') {
                    $filtro .= " and (mrna.idmovregnumerico is null)";
                }
            }
        }

        $conn = Zend_Registry::get('conexion');
        $sql = "
            SELECT su.nombreusuario as usuario, mt.fecha,
                   (CASE when mrna.idmovregnumerico is not null then 'Fisico' else 'Abstracto' END) as tipo_modulo,
                   coalesce(mrna.idmovregnumerico, rna.idregnumerico) as idregistro,
                   coalesce(mrna.valorcontable, rna.valorcontable) as valorcontable,
                   coalesce(mrna.nroinventario, rna.nroinventario) as nroinventario,
                   coalesce(mrna.valoradquisicion, rna.valoradquisicion) as valoradquisicion,
                   coalesce(mrnat.kilometraje, rnat.kilometraje) as kilometraje,
                   coalesce(i.denominacion, pm.denominacion) as denominacion,
                   coalesce(et.denominacion, null) as estado,
                   coalesce(null, rn.nroserie) as nroserie,
                   coalesce((
                           (Case When ih.idmarca is not null
                            Then (marca.denominacion || (Case When ih.idmodelo is not null Then ' - ' Else '' End))
                            Else ''
                            End) ||
                            (Case When ih.idmodelo is not null Then modelo.denominacion Else '' End)), null)
                            as descripcionmarcamodelo



            FROM mod_logactivofijotangible.dat_modulotraza mt
            inner join mod_logactivofijotangible.dat_modulotrazahijos mth on mth.idmodulotraza = mt.idmodulotraza
            inner join mod_seguridad.seg_usuario su on su.idusuario = mt.idusuario

            left outer join mod_logactivofijotangible.dat_movregnumericoactivo mrna
            on mrna.idmovregnumerico = mth.idmovregnumerico
            left join mod_logactivofijotangible.dat_movregnumericoactivotransp mrnat
            on mrnat.idmovregnumerico = mth.idmovregnumerico
            left join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idmovregnumerico = mth.idmovregnumerico
            left join mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
            left join mod_logistica.dat_producto p on m.idproducto = p.idproducto
            left join mod_datosmaestros.nom_indicador i on i.idindicador = p.idprod
            left join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
            left join mod_datosmaestros.nom_marca marca on marca.idmarca = ih.idmarca
            left join mod_datosmaestros.nom_modelo modelo on modelo.idmodelo = ih.idmodelo
            left join mod_logactivofijotangible.nom_estatustecnico et
            on et.idestatustecnico = mrna.idestatustecnico
            left outer join mod_logactivofijotangible.dat_regnumericoactivo rna
            on rna.idregnumerico = mth.idregnumerico
            left join mod_logactivofijotangible.dat_regnumericoactivotransp rnat
             on rnat.idregnumerico = mth.idregnumerico
            left join mod_logactivofijotangible.dat_registronumerico rn on rn.idregnumerico = mth.idregnumerico
            left join mod_logistica.dat_producto p1 on rn.idproducto = p1.idproducto
            left join mod_logactivofijotangible.dat_productomodulo pm on pm.idproducto = p1.idproducto 
                WHERE mt.idregistronumerico = " . $idregnumerico . "{$filtro}";
        $resp = $conn->execute($sql);
        $datos = $resp->fetchAll(PDO::FETCH_ASSOC);
        $cant = count($datos);
        return array('datos' => $datos, 'total' => $cant);
    }

    public function getUsuarios()
    {
        $query = Doctrine_Query::create();
        $query->FROM('DatModulotraza traza');
        $query->addSELECT('DISTINCT traza.idusuario');
        $datos = $query->fetchArray();
        $cant = count($datos);
        for ($i = 0; $i < $cant; $i++) {
            $datos[$i]['usuario'] = $this->serviciosSeg->getNombreUsuario(
                $datos[$i]['idusuario']
            );
        }
        return array('datos' => $datos, 'total' => $cant);
    }

    public function getDatosMedio($parametros)
    {
        $query = new Doctrine_Query();
        $query->from('DatRegnumerico reg')->innerJoin(
            'reg.DatRegnumericoActivo activo'
        )->innerJoin('activo.DatRegnumericoTransp trans')->innerJoin(
            'activo.NomActividadMedio act'
        )->where(
            "reg.idregnumerico = ?", array($parametros['idregnumerico'])
        );
        $resp = $query->fetchArray();
        $datos = array('nroserie' => $resp[0]['nroserie'],
            'nroinventario' => $resp[0]['DatRegnumericoActivo']['nroinventario'],
            'valoradquisicion' => $resp[0]['DatRegnumericoActivo']['valoradquisicion'],
            'valorcontable' => $resp[0]['DatRegnumericoActivo']['valorcontable'],
            'fechaadq' => $resp[0]['DatRegnumericoActivo']['fechaadq'],
            'nromatricula' => $resp[0]['DatRegnumericoActivo']['DatRegnumericoTransp']['nromatricula'],
            'kilometraje' => $resp[0]['DatRegnumericoActivo']['DatRegnumericoTransp']['kilometraje'],
            'ficav' => $resp[0]['DatRegnumericoActivo']['DatRegnumericoTransp']['ficav'],
            'lot' => $resp[0]['DatRegnumericoActivo']['DatRegnumericoTransp']['lot'],
            'nrocirculacion' => $resp[0]['DatRegnumericoActivo']['DatRegnumericoTransp']['nrocirculacion'],
            'actividad' => $resp[0]['DatRegnumericoActivo']['NomActividadMedio']['denominacion']);
        $datos = array($datos);
        return array('datos' => $datos);
    }

    public function getTipoMedio($parametros)
    {
        if ($parametros['idregnumerico']) {
            $idregnumerico = $parametros['idregnumerico'];
        }
        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT 
                    (CASE when mrna.idmovregnumerico is not null then 'Fisico' else 'Abstracto' END) as tipo_modulo
                FROM mod_logactivofijotangible.dat_registronumerico rn
                left outer join mod_logactivofijotangible.dat_movregnumerico mrn on
                mrn.idregnumerico = rn.idregnumerico
                left outer join mod_logactivofijotangible.dat_movregnumericoactivo mrna
                on mrna.idmovregnumerico = mrn.idmovregnumerico
                left outer join mod_logactivofijotangible.dat_regnumericoactivo rna
                on rna.idregnumerico = rn.idregnumerico
                Where rn.idregnumerico = $idregnumerico";
        $resp = $conn->execute($sql);
        $datos = $resp->fetchAll(PDO::FETCH_ASSOC);
        return $datos[0]['tipo_modulo'];
    }

}
