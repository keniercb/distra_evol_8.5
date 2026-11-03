<?php

/**
 * Created by JetBrains PhpStorm.
 * User: Osmel Cutino
 * Date: 10/03/15
 * Time: 11:08
 * To change this template use File | Settings | File Templates.
 */
class GestRegMatriculaModel extends ZendExt_Model
{   // private $serviciosRecursosHumanos;
    private $mComunAFT;
    protected $_sEstrComposicion;

    public function __construct()
    {
        $this->mComunAFT = ComunAFTModel::getInstance();
        $this->_sEstrComposicion = ServiciosEstructuraComposicionHelper::__init();
    }

    public function GestDocTransfEntidadesModel()
    {
        $this->__construct();
        //$this->serviciosRecursosHumanos = ServiciosRecursosHumanosHelper::__init();
    }

    public function cargarGridCentral($parametros)
    {
        $conn = Zend_Registry::get('conexion');
        $SELECT = "SELECT DISTINCT
                    rna.idregnumerico,
                    rna.annofabricacion as annofabricacion,
                    rna.idestatustecnico,
                    rn.nroserie as nroserie,
                    tr.nromatricula as nromatricula,
                    tr.nromotor1 as nromotor1,
                    tr.nromotor2 as nromotor2,
                    color.denominacion as colorptim,
                    colorsec.denominacion as colorsec,                    
                    tcom.denominacion as combustible,
                    ind.codigo as codigo,
                    ind.denominacion as denominacion,
                    nm.denominacion as marca,
                    nmod.denominacion as modelo,
                    dm.idproducto, pro.idindicador,pro.idindicador as idprod,
                   pais.nombrepais as nacionalidad,
                    estatus.denominacion as denomestado";

        $FROM = "     FROM mod_logactivofijotangible.dat_regnumericoactivo rna

                      inner join mod_logactivofijotangible.dat_registronumerico rn on rna.idregnumerico = rn.idregnumerico
                      left join mod_logactivofijotangible.nom_estatustecnico estatus
                      on estatus.idestatustecnico = rna.idestatustecnico
                      inner join mod_logistica.dat_producto pro on pro.idproducto = rn.idproducto
                      inner join mod_logistica.dat_movimiento dm on dm.idproducto = pro.idproducto
                      inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
                      INNER JOIN mod_estructuracomp.nom_filaestruc f ON pro.idestructura = f.idfila
                      inner join mod_datosmaestros.nom_indicador ind on ind.idindicador = pro.idindicador
                      left join mod_datosmaestros.nom_pais pais on pais.idpais = ind.idpais
                      inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ind.idindicador
                      inner join mod_datosmaestros.nom_marca nm on nm.idmarca = nih.idmarca
                      inner join mod_datosmaestros.nom_modelo nmod on nmod.idmodelo = nih.idmodelo
                      left join mod_logactivofijotangible.dat_regnumericoactivotransp tr
                      on tr.idregnumerico = rna.idregnumerico
                      left join mod_logactivofijotangible.nom_tipocombustible tcom
                      on tcom.idtipocombustible = tr.idtipocombustible
                      left join mod_logactivofijotangible.nom_color color on color.idcolor = rna.idcolorprim
                      left join mod_logactivofijotangible.nom_color colorsec on colorsec.idcolor = rna.idcolorsec";

       
        if (!is_array($parametros['idestructura'])) {
            $arrIdesAreas = $this->mComunAFT->getIdEstructurasHijas($parametros['idestructura'], false, true);
        }
        if(count($arrIdesAreas) == 0){
            $estructurastring = " (".$parametros['idestructura'].")";
        }else
        $estructurastring = " (".implode(',', $arrIdesAreas).")";
        $WHERE = " WHERE dd.estado = 3 AND f.idfila IN $estructurastring ";

             /*
        $WHERE = " WHERE dd.estado = 3 AND f.idfila IN (
                                        SELECT idfila FROM mod_estructuracomp.nom_filaestruc
                                            WHERE
                                            lft >= (SELECT lft FROM mod_estructuracomp.nom_filaestruc
                                            WHERE idfila = {$parametros['idestructura']}) AND
                                            rgt <= (SELECT rgt FROM mod_estructuracomp.nom_filaestruc
                                            WHERE idfila = {$parametros['idestructura']})
                                        )   ";   */

        if ($parametros['cargarcentral'] == "true") {
            $FROM .= " inner join mod_logactivofijotangible.dat_registrovehiculo regv
                        on regv.idregnumerico = rna.idregnumerico
                       left join mod_logactivofijotangible.nom_tipotramite tipo on
                       regv.idtipotramite = tipo.idtipotramite
                       left join mod_logactivofijotangible.nom_color colorchapa on
                       colorchapa.idcolor = regv.idcolorchapa
                       left join mod_logactivofijotangible.nom_tipochapa tipochapa on
                       tipochapa.idtipochapa = regv.idtipochapa
                       left join mod_logactivofijotangible.nom_sector sector on sector.idsector = regv.idsector
                       left join mod_persona.dat_persona persona on persona.idpersona = regv.idpersona
                       left join mod_logactivofijotangible.dat_inspectormatricula inspector on
                       inspector.idinspectormatricula = regv.idinspectormatricula
            ";

            if ($parametros['permisoacciones'] != null) {
                $WHERE .= " and regv.tipo = {$parametros['permisoacciones']}";
            }
            /* regv.idtipotramite */
            $SELECT .= " ,regv.registro,regv.idcolorchapa,regv.idtipochapa,regv.idsector,
                         regv.numerolaser1,regv.numerolaser2,regv.tonelage,regv.foliocirculacion,
                          tipo.denominacion as denomtipotramite,colorchapa.denominacion as denomcolorchapa,
                          tipochapa.denominacion as denomtipochapa, sector.denominacion as denomsector,
                          regv.idpersona, persona.nombre || ' ' || persona.papel  || ' ' ||
                          persona.sapel as denompersona,
                          regv.idmoneda,regv.idestructura as regestructura, inspector.nombre as nombreinspector,
                          inspector.idinspectormatricula as idinspectormatricula,regv.jefe,regv.funcionario,regv.acreditador";
        }
        if ($parametros['cargarcentral'] == "false") {
            $WHERE .= " and rna.idregnumerico not in ( select regv.idregnumerico
            from mod_logactivofijotangible.dat_registrovehiculo regv)";
        }
        if ($parametros['codigo']) {
            $codigo = $parametros['codigo'];
            $WHERE .= " AND ind.codigo iLIKE  '%$codigo%'";
        }
        if ($parametros['descripcion']) {
            $descripcion = $parametros['descripcion'];
            $WHERE .= " AND ind.denominacion iLIKE  '%$descripcion%'";
        }
        if ($parametros['matricula']) {
            $matricula = $parametros['matricula'];
            $WHERE .= " AND tr.nromatricula iLIKE  '%$matricula%'";
        }
        if ($parametros['modelo']) {
            $modelo = $parametros['modelo'];
            $WHERE .= " AND nmod.idmodelo = $modelo";
        }
        if ($parametros['marca']) {
            $marca = $parametros['marca'];
            $WHERE .= " AND nm.idmarca = $marca";
        }
        if ($parametros['nrochasi']) {
            $nrochasi = $parametros['nrochasi'];
            $WHERE .= " AND rn.nroserie iLIKE  '%$nrochasi%'";
        }
        if ($parametros['motor1']) {
            $motor1 = $parametros['motor1'];
            $WHERE .= " AND tr.nromotor1 iLIKE  '%$motor1%'";
        }
        if ($parametros['motor1']) {
            $motor1 = $parametros['motor1'];
            $WHERE .= " AND tr.nromotor1 iLIKE  '%$motor1%'";
        }



        if ($parametros['laser1']) {
            $laser1 = $parametros['laser1'];
            $WHERE .= " AND regv.numerolaser1 iLIKE  '%$laser1%'";
        }
        if ($parametros['laser2']) {
            $laser2 = $parametros['laser2'];
            $WHERE .= " AND regv.numerolaser2 iLIKE  '%$laser2%'";
        }
        if ($parametros['tonelage']) {
            $tonelage = $parametros['tonelage'];
            $WHERE .= " AND regv.tonelage = $tonelage";
        }
        if ($parametros['folio']) {
            $folio = $parametros['folio'];
            $WHERE .= " AND regv.foliocirculacion = $folio";
        }


        //laser1, laser2, tonelage, folio

        if ($parametros['combustible']) {
            $combustible = $parametros['combustible'];
            $WHERE .= " AND tcom.idtipocombustible = $combustible";
        }
        if ($parametros['colorprim']) {
            $colorprim = $parametros['colorprim'];
            $WHERE .= " AND color.idcolor = $colorprim";
        }
        if ($parametros['colorsec']) {
            $colorsec = $parametros['colorsec'];
            $WHERE .= " AND colorsec.idcolor = $colorsec";
        }
        if ($parametros['estado']) {
            $estado = $parametros['estado'];
            $WHERE .= " AND estatus.idestatustecnico = $estado";
        }
        if ($parametros['tipotramite']) {
            $tipotramite = $parametros['tipotramite'];
            $WHERE .= " AND tipo.idtipotramite = $tipotramite";
        }
        if ($parametros['colorchapa']) {
            $colorchapa = $parametros['colorchapa'];
            $WHERE .= " AND colorchapa.idcolor = $colorchapa";
        }
        if ($parametros['sector']) {
            $sector = $parametros['sector'];
            $WHERE .= " AND sector.idsector = $sector";
        }
        if ($parametros['tipochapa']) {
            $tipochapa = $parametros['tipochapa'];
            $WHERE .= " AND tipochapa.idtipochapa = $tipochapa";
        }
        if ($parametros['idinspectormatricula']) {
            $idinspector = $parametros['idinspectormatricula'];
            $WHERE .= " AND regv.idinspectormatricula = $idinspector";
        }

        $WHERE .= " AND rna.idestadoperacion <> 0";

        $sqlDatos = $SELECT . $FROM . $WHERE;

        $sqlCount = 'SELECT count (DISTINCT rna.idregnumerico) ' . $FROM . $WHERE;

        if (count($parametros['limit']) > 0) {
            $sqlDatos .= " offset({$parametros['start']}) limit({$parametros['limit']})";
        }
        //$sqlDatos .= " ORDER BY ind.codigo DESC";
        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        
        $contador = 1;

        $queryTramites = Doctrine_Query::create();
        $resultTramites = $queryTramites->select('ntt.*')
            ->from('NomTipoTramite ntt')
            ->fetchArray();
        $arrayTramites = Array();
        foreach ($resultTramites as $tramites) {
            $arrayTramites[$tramites['idtipotramite']] = $tramites['denominacion'];
        }

        foreach ($datos as $i => $general) {
            $query = Doctrine_Query::create();
            $result = $query->select('vtt.idtipotramite')
                ->from('DatVehiculoTipoTramite vtt')
                ->innerJoin('vtt.DatRegVehiculo rv')
                ->Where('rv.idregnumerico = ?', $datos[$i]['idregnumerico'])
                ->fetchArray();            
            $denomTramites = "";

            foreach ($result as $pos => $trami) {
                ($pos < (count($result) - 1)) ? $datos[$i]['idtipotramite'] .= $trami['idtipotramite'] . "," :
                        $datos[$i]['idtipotramite'] .= $trami['idtipotramite'];
                ($pos < (count($result) - 1)) ? $denomTramites.=$arrayTramites[$trami['idtipotramite']] . "," :
                        $denomTramites.=$arrayTramites[$trami['idtipotramite']];
            }
            $datos[$i]['denomtipotramite'] = $denomTramites;
            $datos[$i]['datosgenerales'] .= '<b>Folio circulacion:</b>&nbsp;&nbsp;'
                . $general['foliocirculacion'] . '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            $datos[$i]['datosgenerales'] .= '<b>Número de laser1:</b> &nbsp;&nbsp;'
                . $general['numerolaser1'] . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            $datos[$i]['datosgenerales'] .= '<b>Número de laser2:</b> &nbsp;&nbsp;'
                . $general['numerolaser2'] . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            $datos[$i]['datosgenerales'] .= '<b>Tonelaje: </b>&nbsp;&nbsp;'
                . $general['tonelage'] . '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            $datos[$i]['datosgenerales'] .= '<b>Tipo chapa: </b>&nbsp;&nbsp;'
                . $general['denomtipochapa'] . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            $datos[$i]['datosgenerales'] .= '<b>Tipo de trámite: </b>&nbsp;&nbsp;'
                . $denomTramites . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

            if ($general['idcolorchapa']) {
                $datos[$i]['datosgenerales'] .= '<b>Color de chapa: </b>&nbsp;&nbsp;' . $general['denomcolorchapa'] . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            } else {
                $datos[$i]['datosgenerales'] .= '<b>Color de chapa: </b>&nbsp;&nbsp;';
            }


            $datos[$i]['datosgenerales'] .= '<b>Sector: </b>&nbsp;&nbsp;' . $general['denomsector'] . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

            $datos[$i]['datosgenerales'] .= '<b>Inspector: </b>&nbsp;&nbsp;' . $general['nombreinspector'] . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            $datos[$i]['nro'] .= $contador++;

            if ($general['idmoneda']) { 
                $parametros['idmoneda'] = $general['idmoneda'];
                $moneda = self::getComboMoneda($general['regestructura'], $parametros);
                $datos[$i]['datosgenerales'] .= '<b>Moneda: </b>&nbsp;&nbsp;' . $moneda[0]['nombremoneda'] . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                $datos[$i]['moneda'] = $moneda[0]['nombremoneda'];
            } else {
                
                $datos[$i]['datosgenerales'] .= '<b>Moneda: </b>&nbsp;&nbsp;';
                $datos[$i]['moneda'] = "";               
            }
            /* params['idmoneda'] = $datReg['idmoneda'];
              $datos = $this->gestRegMatriculaModel->getComboMoneda($datReg['regestructura'],$params);
              $result[0][$i]['moneda'] =
              print_r($datos);die; */

            if ($parametros['permisoacciones'] != null) {
                if ($parametros['permisoacciones'] == 1) {
                    $datos[$i]['datosgenerales'].= '<b>Posedor legal:</b> &nbsp;&nbsp; ' . $general['denompersona'] . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    $datos[$i]['poseedorlegal'] = $general['denompersona'];
                    if ($general['idpersona']) {
                        $direcc = self::getBuscarDireccion($general['idpersona']);
                        $datos[$i]['datosgenerales'].= '</br><b>Dirección:</b> &nbsp;&nbsp;' . $direcc[0];
                        $datos[$i]['direccion'] = $direcc[0];
                        $datos[$i]['provincia'] = $direcc[1];
                        $datos[$i]['municipio'] = $direcc[2];
                    } else {
                        $datos[$i]['datosgenerales'].= '</br><b>Dirección:</b> &nbsp;&nbsp;';
                        $datos[$i]['direccion'] = "";
                    }
                } else {
                    if ($general['regestructura']) {   
                       
                        //$ent = $this->_sEstrComposicion->getEstructura($general['regestructura']);
                        $ent = $this->integrator->metadatos->DameEstructura($general['regestructura']);
                        $datos[$i]['datosgenerales'].='<b>Posedor legal: </b>&nbsp;&nbsp;' . $ent[0]->denominacion . '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' . '<b>Dirección:</b> &nbsp;&nbsp;' . $ent[0]->direccion;
                        $datos[$i]['poseedorlegal'] = $ent[0]->denominacion;
                        $datos[$i]['direccion'] = $ent[0]->direccion;
                    } else {
                        $datos[$i]['datosgenerales'].='<b>Posedor legal: </b>&nbsp;&nbsp;';
                        $datos[$i]['datosgenerales'].='<b>Dirección:</b> &nbsp;&nbsp;';
                        $datos[$i]['poseedorlegal'] = "";
                        $datos[$i]['direccion'] = "";
                    }
                }
            }
        };
        $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
        $total = $total[0]['count'];
       
        return array($datos, $total);
    }

    public function getAddRegVehiculo($parametros)
    {

        $colleObj = new Doctrine_Collection('DatRegVehiculo');
        foreach ($parametros['idregnum'] as $value) {
            $datregnumactivo = new DatRegVehiculo();
            $datregnumactivo->idregnumerico = $value;
            // $datregnumactivo->idestructura = $parametros['idestructura'];
            $datregnumactivo->tipo = $parametros['tipoReg'];
            $colleObj->add($datregnumactivo);
        }
        $colleObj->save();

        return 1;
    }

    public function getEliminarMedioTrans($parametros)
    {
        $query = new Doctrine_Query();
        $query->delete()->from('DatRegVehiculo reg')->whereIn('reg.idregnumerico', $parametros['idregnum'])->execute();

        return 1;
    }

    public function getComboTipoTramite($idestructura)
    { 
        if(!$idestructura){
            $idestructura = $this->global->Estructura->idestructura;
        }
       
        $result = Doctrine_Query::create()
            ->select('tt.idtipotramite,tt.denominacion')
            ->from('NomTipoTramite tt')
            ->innerJoin('tt.DatTipoTramiteEntidad dtt')
            ->where("dtt.idestructuracomun =" . $idestructura)
            ->fetchArray();

        return $result;
    }

    public function getComboInspector()
    {

        $result = Doctrine_Query::create()
            ->select('DISTINCT insp.idinspectormatricula, insp.nombre')
            ->from('DatInspectorMatricula insp')
            ->fetchArray();
        return array('datos' => $result, 'total' => count($result));
    }

    public function getComboColorChapa($idestructura)
    {

        $result = Doctrine_Query::create()
            ->select('c.idcolor,c.denominacion')
            ->from('NomColor c')
            ->innerJoin('c.DatColorEntidad ce')
            ->Where("ce.idestructuracomun =" . $idestructura)
            ->fetchArray();

        return $result;
    }

    public function getComboTipoChapa($idestructura)
    {

        $result = Doctrine_Query::create()
            ->select('tch.idtipochapa,tch.denominacion')
            ->from('NomTipoChapa tch')
            ->innerJoin('tch.DatTipoChapaEntidad dtt')
            ->where("dtt.idestructuracomun =" . $idestructura)
            ->fetchArray();

        return $result;
    }

    public function getComboSector($idestructura)
    {

        $result = Doctrine_Query::create()
            ->select('sec.idsector,sec.denominacion')
            ->from('NomSectorRegMatric sec')
            ->innerJoin('sec.DatSectorRegMatricEntidad dtt')
            ->where("dtt.idestructuracomun =" . $idestructura)
            ->fetchArray();

        return $result;
    }

    public function getEstatusTecnico($idestructura)
    {

        $result = Doctrine_Query::create()
            ->select('est.idestatustecnico,est.denominacion')
            ->from('NomEstatustecnico est')
            ->innerJoin('est.DatEstatustecnicoEntidad dtt')
            ->where("dtt.idestructuracomun =" . $idestructura)
            ->fetchArray();

        return $result;
    }

    public function getComboMoneda($idestructura, $parametros)
    {

        $intgrator = ZendExt_IoC::getInstance();
        $moneda = ServiciosConfiguracionGeneralHelper::__init()->obtenerMonedasPorEntidad($idestructura);
        if ($parametros['idmoneda']) {
            foreach ($moneda['datos'] as $mone) {
                if ($mone['idmoneda'] == $parametros['idmoneda']) {
                    $datos[0]['idmoneda'] = $mone['idmoneda'];
                    $datos[0]['nombremoneda'] = $mone['nombremoneda'];
                }
            }
        } else {
            foreach ($moneda['datos'] as $index => $mone) {
                $datos[$index]['idmoneda'] = $mone['idmoneda'];
                $datos[$index]['nombremoneda'] = $mone['nombremoneda'];
            }
        }
        return $datos;
    }

    public function getCompletarDatosMedios($parametros)
    {
        if ($parametros->tonelage) {
            $conn = Zend_Registry::get('conexion');
            $UPDATE = " UPDATE mod_logactivofijotangible.dat_registrovehiculo";

            $SET = " SET tonelage = $parametros->tonelage";
            $WHERE = " where idregnumerico = $parametros->idregnum";

            $sqlDatos = $UPDATE . $SET . $WHERE;
            $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        }

        if ($parametros->nombreinspector) {

            $inspector = new DatInspectorMatricula();
            $inspector->nombre = $parametros->nombreinspector;
            $inspector->save();
            $parametros->idinspectormatricula = $inspector->idinspectormatricula;
        }

        $query = new Doctrine_Query();
        $query->update('DatRegVehiculo rega');
        $query = self::getCompletarDatosMediosIf($query, $parametros);
        if ($parametros->laser2) {
            $query->set('rega.numerolaser2', "'$parametros->laser2'");
        }
        if ($parametros->acreditador) {
            $query->set('rega.acreditador', "'$parametros->acreditador'");
        }
        if ($parametros->funcionario) {
            $query->set('rega.funcionario', "'$parametros->funcionario'");
        }
        if ($parametros->jefe) {
            $query->set('rega.jefe', "'$parametros->jefe'");
        }

        $query->set('rega.registro', 1);

        $query->where('rega.idregnumerico = ?', $parametros->idregnum)->execute();

        if ($parametros->nromatricula) {
            $queryUpdate = Doctrine_Query::create();
            $queryUpdate->update('DatRegnumericoTransp rt')
                ->set('rt.nromatricula', "'$parametros->nromatricula'")
                ->Where('rt.idregnumerico = ?', $parametros->idregnum)->execute();
        }

        self::addTiposTramite($parametros);

        return 1;

        // $objMovimientoRegnumericoActivoTransClonado->save();
    }

    public function getCompletarDatosMediosIf($query, $parametros)
    {
        $query = self::getCompletarDatosMediosIfAdd($query, $parametros);
        if ($parametros->idcolor) {
            $query->set('rega.idcolorchapa', $parametros->idcolor);
        }
        /* if ($parametros->idtipotramite) {
          $query->set('rega.idtipotramite', $parametros->idtipotramite);
          } */
        if ($parametros->moneda) {
            $query->set('rega.idmoneda', $parametros->moneda);
        }
        if ($parametros->idsector) {
            $query->set('rega.idsector', $parametros->idsector);
        }
        if ($parametros->idtipochapa) {
            $query->set('rega.idtipochapa', $parametros->idtipochapa);
        }
        if ($parametros->laser1) {
            $query->set('rega.numerolaser1', "'$parametros->laser1'");
        }

        return $query;
    }

    public function getCompletarDatosMediosIfAdd($query, $parametros)
    {
        if ($parametros->folio) {
            $query->set('rega.foliocirculacion', $parametros->folio);
        }
        if ($parametros->idpersona) {
            $query->set('rega.idpersona', $parametros->idpersona);
        }
        if ($parametros->idestructura) {
            $query->set('rega.idestructura', $parametros->idestructura);
        }
        if ($parametros->idinspectormatricula) {

            $query->set('rega.idinspectormatricula', $parametros->idinspectormatricula);
        } else if ($inspector) {
            $query->set('rega.idinspectormatricula', $inspector->idinspectormatricula);
        }
        return $query;
    }

    public function getMarcas($parametros)
    {
        $where = '';
        if ($parametros['limit']) {
            $limit = " limit {$parametros['limit']}";
            $limit .= " offset {$parametros['start']}";
        }

        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT DISTINCT  marca.idmarca,
                                    marca.denominacion
                FROM mod_datosmaestros.nom_marca marca
                INNER JOIN mod_datosmaestros.dat_marcaentidad marcae ON marca.idmarca = marcae.idmarca
                where  marcae.idestructuracomun = {$parametros['idestructura']}";
// INNER JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
        //mod_datosmaestros.nom_indicadorhoja ih
        $sqlCount = "SELECT count(DISTINCT marca.idmarca)
                FROM mod_datosmaestros.nom_marca marca
                INNER JOIN mod_datosmaestros.dat_marcaentidad marcae ON marca.idmarca = marcae.idmarca
                where  marcae.idestructuracomun = {$parametros['idestructura']}";
        $sqlDatos = $sql . $where . $limit;

        $sqlCount = $sqlCount . $where;
        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        $countdatos = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);

        return array('data' => $datos, 'total' => $countdatos[0]['count']);
    }

    public function getModelos($parametros)
    {
        $where = '';

        if ($parametros['limit']) {
            $limit = " limit {$parametros['limit']}";
            $limit .= " offset {$parametros['start']}";
        }
        if ($parametros['query']) {
            $where .= " and modelo.denominacion iLike '%{$parametros['query']}%'";
        }
        if ($parametros['idmarca']) {
            $idmarca = $parametros['idmarca'];
            $where .= " and mm.idmarca = $idmarca ";
        }

        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT DISTINCT modelo.denominacion,
                                modelo.idmodelo
                FROM mod_datosmaestros.nom_modelo modelo
                INNER JOIN mod_datosmaestros.dat_nommarcamodelo mm on mm.idmodelo = modelo.idmodelo";
        $sqlCount = "SELECT count(DISTINCT modelo.idmodelo)
                FROM mod_datosmaestros.nom_modelo modelo
                INNER JOIN mod_datosmaestros.dat_nommarcamodelo mm on mm.idmodelo = modelo.idmodelo ";

        $sqlDatos = $sql . $where . $limit;
        $sqlCountDatos = $sqlCount . $where;
        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        $datosCount = $conn->execute($sqlCountDatos)->fetchAll(
            PDO::FETCH_ASSOC
        );

        return array('data' => $datos, 'total' => $datosCount[0]['count']);
    }

    public function getBuscarDireccion($idpersona)
    {
        $intgrator = ZendExt_IoC::getInstance();
        $parametro['idpersona'] = $idpersona;
        $direccion = ServiciosRecursosHumanosHelper::__init()->getPrincipalesDatosPersona(array($idpersona));
        // $direccion = ServiciosRecursosHumanosHelper::__init()->buscarPersonaPorArreglodeID(array($idpersona));
        //$direccion = ServiciosRecursosHumanosHelper::__init()->devolverPersonasPrincipalesPersonaById($idpersona);
        // $direccion = ServiciosRecursosHumanosHelper::__init()->getPersonaBuscador($parametro);
        // $direccion = $intgrator->pvd->getDirecciones($idpersona);
        /*print_r($direccion);
        die("Osmel");*/
//var_dump($direccion);die;

        if (is_array($direccion) && count($direccion) > 0) {

            $dir = '';

            if ($direccion[0]['idcalle']) {
                $dir .= ' Calle ' . $direccion[0]['idcalle'];
            }/* else{
              $dir .= ' Calle -,';
              } */
            if ($direccion[0]['entre1']) {
                $dir .= ' Entre ' . $direccion[0]['entre1'];
            }/* else{
              $dir .= ' Entre -,';
              } */
            if ($direccion[0]['entre2']) {
                $dir .= ' Y ' . $direccion[0]['entre2'] . ',';
            } else/* {
              $dir .= ' Y -,';
              } */
            if ($direccion[0]['noedificio']) {
                $dir .= ' Nro Edificio ' . $direccion[0]['noedificio'] . ',';
            }/* else{
              $dir .= ' Nro Edificio -,';
              } */
            if ($direccion[0]['nocasa']) {
                $dir .= ' Nro Casa ' . $direccion[0]['nocasa'] . ',';
            }/* else{
              $dir .= ' Nro Casa -,';
              } */
            if ($direccion[0]['km']) {
                $dir .= ' Kilometro ' + $direccion[0]['km'] . ',';
            }/* else{
              $dir .= ' Kilometro -, ';
              } */

            if ($direccion[0]['iddpa']) {
                $dpa = $intgrator->configuracion->obtenerRutaDPT($direccion[0]['iddpa']);
                $dpa = split('=>', $dpa);
                $dir .= ' ' . $dpa[2] . ',';
                $dir .= ' ' . $dpa[1];
            }/* else{
              $dir .= 'Provincia y municipio -';
              } */
            return array($dir, $dpa[1], $dpa[2]);
        } else {
            return "Sin dirección asignada.";
        }
    }

    public function getcargarColorPorId($parametros)
    {

        $result = Doctrine_Query::create()
            ->select('c.idcolor as idcolor,c.denominacion as denominacion')
            ->from('DatRegVehiculo reg')
            ->innerJoin('reg.NomColor c')
            ->where('c.idcolor = ?', array($parametros['idcolorchapa']))
            ->fetchArray();
        return $result;
    }

    public function getCombustible()
    {

        $result = Doctrine_Query::create()
            ->select('tc.idtipocombustible,tc.denominacion')
            ->from('NomTipocombustible tc')
            ->fetchArray();
        return $result;
    }

    public function getColorPrimario($estructura)
    {

        $result = Doctrine_Query::create()
            ->select('c.idcolor,c.denominacion')
            ->from('NomColor c')
            ->innerJoin('c.DatColorEntidad ce')
            ->addWhere("ce.idestructuracomun =" . $estructura)
            ->fetchArray();
        return $result;
    }

    public function getColorSegundario($estructura)
    {

        $result = Doctrine_Query::create()
            ->select('c.idcolor,c.denominacion')
            ->from('NomColor c')
            ->innerJoin('c.DatColorEntidad ce')
            ->Where("ce.idestructuracomun =" . $estructura)
            ->fetchArray();
        return $result;
    }

    public function getQueryReporteModeloTramite($params)
    {
        
    }

    public function addTiposTramite($parametros)
    {
        $vehiculoTipoTramiteColle = new Doctrine_Collection('DatVehiculoTipoTramite');
        ($parametros->idtipotramite) ? $parametros->idtipotramite = explode(",", $parametros->idtipotramite) : "";
        $query = Doctrine_Query::create();
        $result = $query->select('rv.idregistrovehiculo')
            ->from('DatRegVehiculo rv')
            ->Where('rv.idregnumerico = ?', $parametros->idregnum)
            ->fetchArray();

        if ($result[0]['idregistrovehiculo']) {
            foreach ($parametros->idtipotramite as $id) {
                if (self::verificarExisteVehiculoTipoTramite($id, $result[0]['idregistrovehiculo']) == 0) {
                    $vehiculoTipoTramite = new DatVehiculoTipoTramite();
                    $vehiculoTipoTramite->idregistrovehiculo = $result[0]['idregistrovehiculo'];
                    $vehiculoTipoTramite->idtipotramite = $id;
                    $vehiculoTipoTramiteColle->add($vehiculoTipoTramite);
                }
            }
        }

        $vehiculoTipoTramiteColle->save();
    }

    public function verificarExisteVehiculoTipoTramite($idtipotramite, $idregnum)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('vtt.idvehiculotipotramite')
            ->from('DatVehiculoTipoTramite vtt')
            ->Where('vtt.idregistrovehiculo = ? AND vtt.idtipotramite = ?', array($idregnum, $idtipotramite))
            ->count();

        return $result;
    }

}
