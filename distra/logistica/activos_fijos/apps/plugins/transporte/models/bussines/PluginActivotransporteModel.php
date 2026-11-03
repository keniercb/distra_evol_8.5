<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of PluginActivotransporteModel
 *
 * @author Gerardo
 */
class PluginActivotransporteModel extends BaseModel implements IPluginActivosModel
{
    private $datregnumtransp;
    private $movimientodatregnumtransp;
    private $_activTransporte;

    function __construct()
    {
        parent::__construct();
        $this->datregnumtransp = new DatRegnumericoTransp();
        $this->movimientodatregnumtransp = new DatMovRegnumericoTransp();
        $obj = new ConfparametrosgeneralesModel();
        $this->_activTransporte = $obj->getConfiguracionPG(null, 0);
    }

    public function addJoinModel(Doctrine_Query $query, $aliasExterno, $aliasLocal, $includeSelect = true,
        $parametros = array())
    {
        if ($this->_activTransporte[0]['transporte'] != 0){
            //print_r($this->_activTransporte[0]['transporte']);die("askdjaskld");
            $query->leftJoin("$aliasExterno.DatRegnumericoTransp $aliasLocal");
            if ($includeSelect) {
                $query->addSelect($this->getQuerySelectFields($aliasLocal));
                $this->addLeftJoinNomtablasAlternas($aliasLocal, $query);
            }
        }
    }

    public function addJoinModelMov(Doctrine_Query $query, $aliasExterno, $aliasLocal, $includeSelect = true,
        $parametros = array())
    {
        if ($this->_activTransporte[0]['transporte'] != 0){
            $query->leftJoin("$aliasExterno.DatMovRegnumericoTransp $aliasLocal");
            if ($includeSelect) {
                $this->addLeftJoinNomtablasAlternas($aliasLocal, $query);
                $query->addSelect($this->getQuerySelectFields($aliasLocal));
            }
        }
    }

    public function addQueryFilters(Doctrine_Query $query, $aliasTabla, $parametros = array())
    {
        if ($this->_activTransporte[0]['transporte'] != 0){
            if ($parametros['nromatricula']) {
                $query->addWhere(
                    "{$aliasTabla}.nromatricula iLike '%{$parametros['nromatricula']}%'"
                );
            }
            if ($parametros['vin']) {
                $query->addWhere(
                    "{$aliasTabla}.vin iLike '%{$parametros['vin']}%'"
                );
            }
            if ($parametros['nromotor1']) {
                $query->addWhere(
                    "{$aliasTabla}.nromotor1 iLike '%{$parametros['nromotor1']}%'"
                );
            }
            if ($parametros['nromotor2']) {
                $query->addWhere(
                    "{$aliasTabla}.nromotor2 iLike '%{$parametros['nromotor2']}%'"
                );
            }
            if ($parametros['indicativo']) {
                $query->addWhere(
                    "{$aliasTabla}.indicativo  = ?", array($parametros['indicativo'])
                );
            }
            if ($parametros['indiceconsumo']) {
                $query->addWhere(
                    "{$aliasTabla}.indiceconsumo = ?", array($parametros['indiceconsumo'])
                );
            }
            if ($parametros['nollaveencendido']) {
                $query->addWhere(
                    "{$aliasTabla}.nollaveencendido iLike '%{$parametros['nollaveencendido']}%'"
                );
            }
            if ($parametros['lot']) {
                $query->addWhere("{$aliasTabla}.lot = '{$parametros['lot']}'");
            }
            if ($parametros['ficav']) {
                $query->addWhere("{$aliasTabla}.ficav = '{$parametros['ficav']}'");
            }
            if ($parametros['idtipocombustible']) {
                $query->addWhere(
                    "{$aliasTabla}.idtipocombustible = ?", array($parametros['idtipocombustible'])
                );
            }
            if ($parametros['nrocirculacion']) {
                $query->addWhere(
                    "{$aliasTabla}.nrocirculacion iLike '%{$parametros['nrocirculacion']}%'"
                );
            }
            if ($parametros['capacidad']) {
                $query->addWhere(
                    "{$aliasTabla}.capacidad = ?", array($parametros['capacidad'])
                );
            }if ($parametros['endeposito']) {
                $query->addWhere(
                    "{$aliasTabla}.endeposito = ?", array($parametros['endeposito'])
                );
            }
            if ($parametros['idtipocombustible']) {
                $query->addWhere(
                    "{$aliasTabla}.idtipocombustible =".$parametros['idtipocombustible']
                );
            }
            //array de matrulas que vienen del exel
            if ($parametros['arreglomatriculas']) {
                $query->andWhereIn("{$aliasTabla}.nromatricula", $parametros['arreglomatriculas']);
            }
            if ($parametros['vencimientolot']) {
                $query->addWhere("{$aliasTabla}.vencimientolot = '{$parametros['vencimientolot']}'");
            }
            if($parametros['min_vencimientolot']){
                $query->addWhere("{$aliasTabla}.vencimientolot > ?", $parametros['min_vencimientolot']);
            }
            if($parametros['max_vencimientolot']){
                $query->addWhere("{$aliasTabla}.vencimientolot < ?", $parametros['max_vencimientolot']);
            }

            if ($parametros['vencimientoficav']) {
                $query->addWhere("{$aliasTabla}.vencimientoficav = '{$parametros['vencimientoficav']}'");
            }
            if($parametros['min_vencimientoficav']){
                $query->addWhere("{$aliasTabla}.vencimientoficav > ?", $parametros['min_vencimientoficav']);
            }
            if($parametros['max_vencimientoficav']){
                $query->addWhere("{$aliasTabla}.vencimientoficav < ?", $parametros['max_vencimientoficav']);
            }

            if ($parametros['vencimientocirculacion']) {
                $query->addWhere("{$aliasTabla}.vencimientocirculacion = '{$parametros['vencimientocirculacion']}'");
            }
            if($parametros['min_vencimientocirculacion']){
                $query->addWhere("{$aliasTabla}.vencimientocirculacion > ?", $parametros['min_vencimientocirculacion']);
            }
            if($parametros['max_vencimientocirculacion']){
                $query->addWhere("{$aliasTabla}.vencimientocirculacion < ?", $parametros['max_vencimientocirculacion']);
            }

            if ($parametros['expedicioncirculacion']) {
                $query->addWhere("{$aliasTabla}.expedicioncirculacion = '{$parametros['expedicioncirculacion']}'");
            }
            if($parametros['min_expedicioncirculacion']){
                $query->addWhere("{$aliasTabla}.expedicioncirculacion > ?", $parametros['min_expedicioncirculacion']);
            }
            if($parametros['max_expedicioncirculacion']){
                $query->addWhere("{$aliasTabla}.expedicioncirculacion < ?", $parametros['max_expedicioncirculacion']);
            }
            if($parametros['kmasignado']){
                $query->addWhere("{$aliasTabla}.kmasignado < ?", $parametros['kmasignado']);
            }

            if ($parametros['Datos transporte']) {
                $parametros['Datos transporte'] = split(',', $parametros['Datos transporte']);
                foreach ($parametros['Datos transporte'] as $camposnull) {
                    $query->addWhere("{$aliasTabla}.{$camposnull} is null");
                }
            }

            if ($parametros['min_ficav']) {
                $query->addWhere("{$aliasTabla}.ficav >= ?", $parametros['min_ficav']);
            }
            if ($parametros['max_ficav']) {
                $query->addWhere("{$aliasTabla}.ficav <= ?", $parametros['max_ficav']);
            }
            if ($parametros['min_lot']) {
                $query->addWhere("{$aliasTabla}.lot >=?", $parametros['min_lot']);
            }
            if ($parametros['max_lot']) {
                $query->addWhere("{$aliasTabla}.lot <= ?", $parametros['max_lot']);
            }
            if ($parametros['min_vencimientolot']) {
                $query->addWhere("{$aliasTabla}.vencimientolot >= ?", $parametros['min_vencimientolot']);
            }
            if ($parametros['max_vencimientolot']) {
                $query->addWhere("{$aliasTabla}.vencimientolot <= ?", $parametros['max_vencimientolot']);
            }
            if ($parametros['min_vencimientoficav']) {
                $query->addWhere("{$aliasTabla}.vencimientoficav >= ?", $parametros['min_vencimientoficav']);
            }
            if ($parametros['max_vencimientoficav']) {
                $query->addWhere("{$aliasTabla}.vencimientoficav <= ?", $parametros['max_vencimientoficav']);
            }
            //print_r($parametros);
            if ($parametros['min_vencimientocirculacion']) {
                //print_r('entra min');
                $query->addWhere("{$aliasTabla}.vencimientocirculacion >= ?", $parametros['min_vencimientocirculacion']);
            }
            if ($parametros['min_expedicioncirculacion']) {
                $query->addWhere("{$aliasTabla}.expedicioncirculacion >= ?", $parametros['min_expedicioncirculacion']);
            }
            if ($parametros['max_vencimientocirculacion']) {
                //print_r('entra max');die;
                $query->addWhere("{$aliasTabla}.vencimientocirculacion <= ?", $parametros['max_vencimientocirculacion']);
            }
            if ($parametros['max_expedicioncirculacion']) {
                $query->addWhere("{$aliasTabla}.expedicioncirculacion <= ?", $parametros['max_expedicioncirculacion']);
            }
        }
    }

    public function beforeDelete($identifier)
    {
        return;
    }

    public function beforeSave(Doctrine_Record $model, $parametros = array())
    {
        $model->DatRegnumericoTransp->synchronizeWithArray($parametros);
    }

    public function getQuerySelectFields($alias)
    {
        $arrayQueryStrings = array(
            'nromatricula' => '_p.nromatricula',
            'nrocirculacion' => '_p.nrocirculacion',
            'nromotor2' => '_p.nromotor2',
            'nromotor1' => '_p.nromotor1',
            'indiceconsumo' => '_p.indiceconsumo',
            'indicativo' => '_p.indicativo',
            'nollaveencendido' => '_p.nollaveencendido',
            'ficav' => '_p.ficav',
            'lot' => '_p.lot',
            'capacidad' => '_p.capacidad',
            'endeposito' => '_p.endeposito',
            'vin' => '_p.vin',
            'idtipocombustible' => '_p.idtipocombustible',
            'vencimientolot' => '_p.vencimientolot',
            'vencimientoficav' => '_p.vencimientoficav',
            'expedicioncirculacion' => '_p.expedicioncirculacion',
            'vencimientocirculacion' => '_p.vencimientocirculacion',
            'normacombustible' => '_p.normacombustible',
            'cantpersonasentado' => '_p.cantpersonasentado',
            'cantpersonapie' => '_p.cantpersonapie',
            'idgps' => '_p.idgps',
            'idcategoriatransp' => '_p.idcategoriatransp',
            'kmasignado' => '_p.kmasignado',
            // 'nrochasis' => '_p.nrochasis',
        );
        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_p');
    }

    public function initBaseRelation(Doctrine_Record $DtaregnumericoActivo)
    {
        $array[] = array('cardinalidad' => 'one',
            'relation' => 'DatRegnumericoTransp',
            'properties' => array('local' => 'idregnumerico',
                'foreign' => 'idregnumerico'));
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($DtaregnumericoActivo, $array);
    }

    public function getMov()
    {
        //->leftJoin('mrnat.NomTipocombustible ntc')
    }

    public function pre_beforeSaveMov($parametros)
    {
        $existe = null;
        if ($parametros['idregnumerico']) {
            $existe = $this->buscarMatriculayIndicativo($parametros);
        }
        return $existe;
    }

    public function beforeSaveMov(Doctrine_Record $model, $parametros = array())
    {   
        $this->initBaseMovRelation($model);
        $model->DatMovRegnumericoTransp->synchronizeWithArray($parametros);
    }

    public function initBaseMovRelation(Doctrine_Record $model)
    {
        $array[] = array('cardinalidad' => 'one',
            'relation' => 'DatMovRegnumericoTransp',
            'properties' => array('local' => 'idmovregnumerico',
                'foreign' => 'idmovregnumerico'));
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($model, $array);
    }

    public function beforeDeleteMov($identifier)
    {
        
    }

    public function crearMovRegNumericoDesdeRegNumerico(Doctrine_Record $modelo, $idmovimiento, $arridsreg)
    {
        $query = new Doctrine_Query();
        $query->from('DatRegnumericoTransp rnat');
        $query->leftJoin('rnat.DatRegnumericoActivo rna');
        $query->leftJoin('rna.DatRegnumerico rn');
        $query->leftJoin('rn.DatMovRegnumerico mrn');
        $query->whereIn('rnat.idregnumerico', array($arridsreg));
        //$query->where('mrn.idmovimiento = ?', $idmovimiento);
        $query->addSelect($this->getQuerySelectFields('rnat'));
        $datos = $query->fetchArray();

        $this->beforeSaveMov($modelo, $datos[0]);
    }

    public function buscarMatriculayIndicativo($datos)
    {
        $query = Doctrine_Query::create();
        $queryI = Doctrine_Query::create();
        $existe = array();
        $index = 0;
        $query->select(
            'DISTINCT (mrnt.idmovregnumerico) as idmovregnumerico,
                    mrn.idregnumerico,mrnt.nromatricula'
        );
        $query->from('DatMovRegnumericoTransp mrnt');

        $queryI->select(
            'DISTINCT (mrnt.idmovregnumerico) as idmovregnumerico,
                    mrn.idregnumerico,mrnt.nromatricula'
        );
        $queryI->from('DatMovRegnumericoTransp mrnt');


        if ($datos['idregnumerico']) {
            $query->innerJoin('mrnt.DatMovRegnumericoActivo mrna');
            $query->innerJoin('mrna.DatMovRegnumerico mrn');
            $query->addWhere('mrn.idregnumerico <> ?', $datos['idregnumerico']);
            $query->addSelect('mrna.idmovregnumerico');

            $queryI->innerJoin('mrnt.DatMovRegnumericoActivo mrna');
            $queryI->innerJoin('mrna.DatMovRegnumerico mrn');
            $queryI->addWhere('mrn.idregnumerico <> ?', $datos['idregnumerico']);
            $queryI->addSelect('mrna.idmovregnumerico');
        }

        if ($datos['indicativo']) {
            $queryI->whereIn('mrnt.indicativo', $datos['indicativo']);
            if ($queryI->fetchArray() != null) {
                $existe [$index] = "Indicativo";
                $index = 1;
            }
        }
        if ($datos['nromatricula']) {
            $query->whereIn('mrnt.nromatricula', $datos['nromatricula']);
            if ($query->fetchArray() != null) {
                $existe [$index] = 'N.º matr&iacute;cula';
            }
        }
        return $existe;
    }

    public function clonarMovimiento($idmovregnumericoAclonar, $idmovregnumericoClonado)
    {
        $this->movimientodatregnumtransp->ClonarMovimiento($idmovregnumericoAclonar, $idmovregnumericoClonado);
    }

    public function getDatRegnumericoActivoplugin($idregnumerico)
    {
        $objDatRegnumericoActivoTransp = Doctrine::getTable('DatRegnumericoTransp')->find($idregnumerico);
        if ($objDatRegnumericoActivoTransp) {
            return $objDatRegnumericoActivoTransp;
        }
    }

    public function addLeftJoinNomtablasAlternas($alias, $query)
    {
        $query->addSelect('tipcom.denominacion AS denomtipocombustible');

        $query->leftJoin("$alias.NomTipocombustible tipcom");
    }

    public function leftJoinDatAlternosRegNumerico($alias, $query)
    {
        
    }

    public function preBeforeSaveMov($parametros)
    {
        
    }

    public function importarDatosExcel($conn, $idEstructura, $idDocumento)
    { 

        $insertarRegNumericoTransp = "
            INSERT INTO mod_logactivofijotangible.dat_regnumericoactivotransp(
            idregnumerico, idtipocombustible, nromatricula, nromotor1, nromotor2, capacidad, indiceconsumo,
            indicativo, nrocirculacion, nollaveencendido, vin, ficav, lot, combustibleasignado, kmasignado, expedicioncirculacion, vencimientoficav,
            vencimientocirculacion, vencimientolot, tipocombustible, idcategoriatransp)
            select distinct rn.idregnumerico, dimpt.idtipocombustible, dimpt.nromatricula,
            dimpt.nromotor1, dimpt.nromotor2, dimpt.capacidad, dimpt.indiceconsumo, dimpt.indicativo,
            dimpt.nrocirculacion,
            dimpt.nollaveencendido, dimpt.vin, dimpt.ficav, dimpt.lot, dimpt.combustibleasignado, dimpt.kmasignado, dimpt.expedicioncirculacion, dimpt.vencimientoficav,
            dimpt.vencimientocirculacion, dimpt.vencimientolot, dimpt.tipocombustible, cat.idcategoriatransp
            from mod_logistica.dat_producto dp
            inner join mod_logactivofijotangible.dat_importartmp dimp on dp.idindicador = dimp.idindicador
            inner join mod_logactivofijotangible.dat_registronumerico rn on dp.idproducto = rn.idproducto
            inner join mod_logactivofijotangible.dat_importartmptransp dimpt on dimp.idimportar = dimpt.idimportar
            left join mod_logactivofijotangible.nom_categoriatransp cat on cat.idcategoriatransp = dimpt.idcategoriatransp
            where dp.idestructura = ".$idEstructura." AND rn.idregnumerico = dimpt.idimportar
            ";
        $conn->execute($insertarRegNumericoTransp);

        $insertDatMovRegNumericoTrasnp = "
        INSERT INTO mod_logactivofijotangible.dat_movregnumericoactivotransp
        (idmovregnumerico, idtipocombustible, nromatricula, nromotor1, nromotor2, capacidad, indiceconsumo,
        indicativo, nrocirculacion, nollaveencendido, vin, ficav, lot, combustibleasignado, kmasignado, expedicioncirculacion, vencimientoficav,
        vencimientocirculacion, vencimientolot, tipocombustible, idcategoriatransp)
        select DISTINCT mrn.idmovregnumerico, dimpt.idtipocombustible, dimpt.nromatricula,
        dimpt.nromotor1, dimpt.nromotor2, dimpt.capacidad, dimpt.indiceconsumo, dimpt.indicativo,
        dimpt.nrocirculacion,
        dimpt.nollaveencendido, dimpt.vin, dimpt.ficav, dimpt.lot, dimpt.combustibleasignado, dimpt.kmasignado, dimpt.expedicioncirculacion, dimpt.vencimientoficav,
        dimpt.vencimientocirculacion, dimpt.vencimientolot, dimpt.tipocombustible, cat.idcategoriatransp
        from mod_logistica.dat_producto dp
        inner join mod_logistica.dat_movimiento m on dp.idproducto = m.idproducto
        inner join mod_logactivofijotangible.dat_importartmp dimp on dp.idindicador = dimp.idindicador
        inner join mod_logactivofijotangible.dat_importartmptransp dimpt on dimp.idimportar = dimpt.idimportar
        left join mod_logactivofijotangible.nom_categoriatransp cat on cat.idcategoriatransp = dimpt.idcategoriatransp

        inner join mod_logactivofijotangible.dat_registronumerico rn on dp.idproducto = rn.idproducto
        inner join mod_logactivofijotangible.dat_movregnumerico mrn on m.idmovimiento = mrn.idmovimiento
        inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrn.idmovregnumerico = mrna.idmovregnumerico
        where dp.idestructura = ".$idEstructura."
        AND rn.idregnumerico = dimp.idimportar
        AND m.iddocumento = ".$idDocumento."
        AND mrn.idregnumerico = rn.idregnumerico";
        $conn->execute($insertDatMovRegNumericoTrasnp);
    }

    public function ValidarInsertarTablaTemporal($datos)
    {
        //return array("cod" => 5, "cadena" => 'el valor de la fecha de fin de garant\xeda');
        return array("cod" => 1);
    }

    public function InsertarTablaTemporal($datos)
    { 

        $insertDatImportarTemp = "INSERT INTO mod_logactivofijotangible.dat_importartmptransp(idimportar, 
        idtipocombustible, nrocirculacion, nromatricula, nromotor1, nromotor2, indiceconsumo, indicativo, 
        nollaveencendido, capacidad, vin, ficav, lot, combustibleasignado, expedicioncirculacion, vencimientoficav,
         vencimientocirculacion, vencimientolot, kmasignado,
         cantpersonapie , cantpersonasentado, normacombustible, idgps, idcategoriatransp, endeposito , tipocombustible) VALUES ";

         
        foreach ($datos as $i => $data) {
            $idtipocombustible = ($data->idtipocombustible) ? $data->idtipocombustible : 'null';
            $nrocirculacion = ($data->nrocirculacion) ? "'".$data->nrocirculacion."'" : 'null';
            $nromatricula = ($data->nromatricula) ? "'".$data->nromatricula."'" : 'null';
            $nromotor1 = ($data->nromotor1) ? "'".$data->nromotor1."'" : 'null';
            $nromotor2 = ($data->nromotor2) ? "'".$data->nromotor2."'" : 'null';
           // $indiceconsumo = ($data->indiceconsumo) ? $data->indiceconsumo : 'null';
            $indiceconsumo = ($data->indiceconsumo) ? "'".$data->indiceconsumo."'" : 'null';


            $indicativo = ($data->indicativo) ? "'".$data->indicativo."'" : 'null';
            $nollaveencendido = ($data->nollaveencendido) ? "'".$data->nollaveencendido."'" : 'null';
            $capacidad = ($data->capacidad) ? $data->capacidad : 'null';
            $vin = ($data->vin) ? "'".$data->vin."'" : 'null';
            $combustibleasignado = ($data->combustibleasignado) ? $data->combustibleasignado : 'null';
            $kmasignado = ($data->kmasignado) ? $data->kmasignado : 'null';
            $cantpersonapie = ($data->cantpersonapie) ? $data->cantpersonapie : 'null';
            $cantpersonasentado = ($data->cantpersonasentado) ? $data->cantpersonasentado : 'null';
            $normacombustible = ($data->normacombustible) ? $data->normacombustible : 'null';
            $idgps = ($data->idgps) ? "'".$data->idgps."'" : 'null';
            $idcategoriatransp = ($data->idcategoriatransp) ? $data->idcategoriatransp : 'null';
            $endeposito = ($data->endeposito) ? $data->endeposito : 'null';
            $tipocombustible = ($data->vin) ? "'".$data->tipocombustible."'" : 'null';
          //  $nrochasis = ($data->nrochasis) ? $data->nrochasis : 'null';
            //print_r($data);die;

            if ($data->ficav) {
                $ficav = ImportMovActivoFijoModel::tratamientofechaimportar($data->ficav);
                if (!$ficav) {
                    return array("cod" => 5, "cadena" => 'el valor de la fechac ficav');
                }
            } else {
                $ficav = 'null';
            }
            if ($data->lot) {
                $lot = ImportMovActivoFijoModel::tratamientofechaimportar($data->lot);
                if (!$lot) {
                    return array("cod" => 5, "cadena" => 'el valor de la fechac lot');
                }
            } else {
                $lot = 'null';
            }
            if ($data->expedicioncirculacion) {
                $expedicioncirculacion
                    = ImportMovActivoFijoModel::tratamientofechaimportar($data->expedicioncirculacion);
                if (!$expedicioncirculacion) {
                    return array("cod" => 5, "cadena" => 'el valor de la fecha de expedici\xf3n de la circulaci\xf3n');
                }
            } else {
                $expedicioncirculacion = 'null';
            }
            if ($data->vencimientoficav) {
                $vencimientoficav = ImportMovActivoFijoModel::tratamientofechaimportar($data->vencimientoficav);
                if (!$vencimientoficav) {
                    return array("cod" => 5, "cadena" => 'el valor de la fecha de vencimiento de FICAV');
                }
            } else {
                $vencimientoficav = 'null';
            }
            if ($data->vencimientocirculacion) {
                $vencimientocirculacion =
                    ImportMovActivoFijoModel::tratamientofechaimportar($data->vencimientocirculacion);
                if (!$vencimientocirculacion) {
                    return array("cod" => 5, "cadena" => 'el valor de la fecha de vencimiento de la circulaci\xf3n');
                }
            } else {
                $vencimientocirculacion = 'null';
            }
            if ($data->vencimientolot) {
                $vencimientolot = ImportMovActivoFijoModel::tratamientofechaimportar($data->vencimientolot);
                if (!$vencimientolot) {
                    return array("cod" => 5, "cadena" => 'el valor de la fecha de vencimiento de LOT');
                }
            } else {
                $vencimientolot = 'null';
            }
            
            $consultaIdTablaImport = "SELECT imp.idimportar FROM mod_logactivofijotangible.dat_importartmp imp WHERE
            imp.idconsecutivo = ".$data->idconsecutivo." AND imp.iddocumento = ".$data->iddocumento." AND
            imp.direccionip = ".$data->direccionip;
            $insertDatImportarTemp .= "((".$consultaIdTablaImport."), ";
             $insertDatImportarTemp .=
                $idtipocombustible.", ".$nrocirculacion.", ".$nromatricula.", ".$nromotor1.", ".
                $nromotor2.", ".$indiceconsumo.", ".$indicativo.", ".$nollaveencendido.", ".$capacidad.
                ", ".$vin.", ".$ficav.", ".$lot.", ".$combustibleasignado. ", " . $expedicioncirculacion . ", "
                . $vencimientoficav . ", " . $vencimientocirculacion . ", " . $vencimientolot .", " . $kmasignado . "," . $cantpersonapie . ",
                " . $cantpersonasentado . "," . $normacombustible . "," . $idgps . ", " . $idcategoriatransp . "," . $endeposito . "," . $tipocombustible . ")";
            if ($i + 1 != count($datos)) {
                $insertDatImportarTemp .= ", ";
            }
        }


        $conn = Zend_Registry::get('conexion');
        $resp = $conn->execute($insertDatImportarTemp);
    }

    public function clonePluginsData($arrReNOld, $arrRNNew)
    {
        $conn = Zend_Registry::get('conexion');
        $resultnew = $conn->fetchAll(
            "select * from \"mod_logactivofijotangible\".\"f_duplicarplugintransporte\"('$arrReNOld', "."'$arrRNNew')"
        );
    }

    public function getMediosTransporte($parametros)
    {

        $sql = "SELECT
                    drna.idregnumerico, dp.idproducto,
                    drna.nroinventario, drna.depreciacionacumulada, drna.vidautil, drna.porcientorecuperacion,
                    drna.valorcontable, drna.fechaexpini, drna.fechaexpfin, drna.fechaadq, drna.tasafiscal, 
                    drna.idarearesp, drna.idcolorprim, drna.idcolorsec, drna.valoradquisicion, drna.idcentrocosto, 
                    drna.idestatustecnico, drna.idubicacion, drna.idactividad, drna.annofabricacion, drna.idcategoria,
                    drna.idresponsable, drna.cantidadrecursoconsumido, drnat.nromatricula, drnat.nrocirculacion, 
                    drnat.nromotor2, drnat.nromotor1, drnat.indiceconsumo, drnat.indicativo, drnat.nollaveencendido, 
                    drnat.ficav, drnat.lot, drnat.capacidad, drnat.vin, drnat.idtipocombustible,drnat.kmasignado,
                    ntipocomb.denominacion as tipocombustible, drna.idpadre, drna.idarbol, drna.ordender,
                    drna.ordenizq, drna.idarbol, drna.asignado, drna.esmodulo, drna.esbaja, drna.plantilla, 
                    drna.estaentidad, drna.valormodulo, rn.idproducto, rn.nroserie, dplant.denominacion, 
                    dplant.color, drna.recursoconsumidomax, drna.fechainicialgarantia, drna.fechafingarantia, 
                    drna.idestadoperacion, ngs.denominacion,
                    (ni.denominacion || ' '||
                        (
                            (Case When nih.idmarca is not null Then (nmarca.denominacion  || 
                            (Case When nih.idmodelo is not null Then ' - ' Else '' End)) Else '' End)  ||
                            (Case When nih.idmodelo is not null Then nmodelo.denominacion Else '' End)
                        )
                    ) AS denominacionindicador,
                    nestatus.denominacion AS estado, nestatus.idestatustecnico, nact.denominacion AS actividad, 
                    ncolo.denominacion AS color1, ncolor.denominacion AS colo2,
                    ncat.denominacion AS categoria, destubic.descripcion AS estructuraubbicacion, dper.idpersona,
                    (
                        (Case When dper.nombre is not null Then (dper.nombre|| 
                        (Case When dper.papel is not null Then ' ' Else '' End)) Else '' End)||
                        (Case When dper.papel is not null Then (dper.papel || 
                        (Case When dper.sapel is not null Then ' ' Else '' End)) Else '' End)||
                        (Case When dper.sapel is not null Then dper.sapel Else '' End)
                    ) AS nombrepersona, ni.idindicador,
                     ni.denominacion AS denomindicador,
                    ni.idnaturaleza, ni.codigo, (ni.codigo || ' - ' || ni.denominacion) AS codigodenom,
                    ni.idtabla, ni.idtablageneral, ni.arridtablas, ni.arridtablasgenerales, nih.idmarca,
                    nih.idgruposubgrupo, nih.idmodelo,
                    dmrn.idmovregnumerico, dmrn.idmovimiento, nmarca.denominacion AS marca, 
                    nmodelo.denominacion AS modelo
                FROM mod_logactivofijotangible.dat_regnumericoactivo drna
                LEFT JOIN mod_logactivofijotangible.dat_regnumericoactivotransp drnat ON 
                drna.idregnumerico = drnat.idregnumerico
                LEFT JOIN mod_logactivofijotangible.nom_tipocombustible ntipocomb ON 
                drnat.idtipocombustible = ntipocomb.idtipocombustible
                LEFT JOIN mod_logistica.nom_categoria ncat ON drna.idcategoria = ncat.idcategoria
                LEFT JOIN mod_logactivofijotangible.dat_responsable dresp ON (dresp.idresponsable = drna.idresponsable)
                LEFT JOIN mod_logactivofijotangible.nom_color ncolo ON (drna.idcolorprim = ncolo.idcolor)
                LEFT JOIN mod_logactivofijotangible.nom_color ncolor ON (drna.idcolorsec = ncolor.idcolor)
                LEFT JOIN mod_logubicacion.dat_estructuraubicacion destubic ON 
                drna.idubicacion = destubic.idestructuraubicacion
                LEFT JOIN mod_logactivofijotangible.nom_estatustecnico nestatus ON
                drna.idestatustecnico = nestatus.idestatustecnico
                LEFT JOIN mod_logactivofijotangible.nom_actividad nact ON drna.idactividad = nact.idactividad
                LEFT JOIN mod_persona.dat_persona dper ON dresp.idpersona = dper.idpersona
                INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON drna.idregnumerico = rn.idregnumerico
                INNER JOIN mod_logistica.dat_producto dp ON rn.idproducto = dp.idproducto
                LEFT JOIN mod_datosmaestros.nom_indicador ni ON dp.idindicador = ni.idindicador
                LEFT JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador
                LEFT JOIN mod_datosmaestros.nom_gruposubgrupo ngs ON nih.idgruposubgrupo = ngs.idgruposubgrupo
                LEFT JOIN mod_datosmaestros.nom_marca nmarca ON nih.idmarca = nmarca.idmarca
                LEFT JOIN mod_datosmaestros.nom_modelo nmodelo ON nih.idmodelo = nmodelo.idmodelo
                LEFT JOIN mod_logactivofijotangible.dat_plantilla dplant ON drna.idregnumerico = dplant.idregnumerico
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico dmrn ON rn.idregnumerico = dmrn.idregnumerico
                INNER JOIN mod_logistica.dat_movimiento dm ON dmrn.idmovimiento = dm.idmovimiento
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo dmrna ON
                dmrn.idmovregnumerico = dmrna.idmovregnumerico
                INNER JOIN mod_logistica.dat_documento dd ON dm.iddocumento = dd.iddocumento
                INNER JOIN mod_logactivofijotangible.conf_tipomedionaturaleza c ON ni.idnaturaleza = c.idnaturaleza
                LEFT JOIN mod_logactivofijotangible.dat_movregnumericoactivotransp dmrnat ON 
                dmrna.idmovregnumerico = dmrnat.idmovregnumerico

                WHERE drna.idregnumerico IN (
                    SELECT doctrine_subquery_alias.idregnumerico
                    FROM (
                        SELECT DISTINCT drna1.idregnumerico
                        FROM mod_logactivofijotangible.dat_regnumericoactivo drna1
                        INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drna1.idregnumerico = drn1.idregnumerico
                        INNER JOIN mod_logistica.dat_producto dp1 ON drn1.idproducto = dp1.idproducto
                        INNER JOIN mod_datosmaestros.nom_indicador ni1 ON dp1.idindicador = ni1.idindicador
                        INNER JOIN mod_logactivofijotangible.dat_movregnumerico dmrn1 ON drn1.idregnumerico = dmrn1.idregnumerico
                        INNER JOIN mod_logistica.dat_movimiento dm1 ON dmrn1.idmovimiento = dm1.idmovimiento
                        INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo ncat6 ON 
                        dmrn1.idmovregnumerico = ncat6.idmovregnumerico
                        INNER JOIN mod_logistica.dat_documento dd1 ON dm1.iddocumento = dd1.iddocumento
                        INNER JOIN mod_logactivofijotangible.conf_tipomedionaturaleza c2 ON ni1.idnaturaleza = c2.idnaturaleza
                        WHERE drna1.plantilla = 1";
        if ($parametros['tipomedio']) {
            $sql .= " AND c2.tipo = {$parametros['tipomedio']} ";
        }
        if ($parametros['idestructura']) {
            $sql .= " AND dp1.idestructuracomun = {$parametros['idestructura']} ";
        }

        $sql .= " ORDER BY drna1.idregnumerico DESC) AS doctrine_subquery_alias)
                AND (drna.plantilla = 1 ";
        if ($parametros['tipomedio']) {
            $sql .= " AND c.tipo = {$parametros['tipomedio']} ";
        }
        if ($parametros['criterio']) {
            $sql .= " AND ni.denominacion ILIKE '%{$parametros['criterio']}%' ";
        }

        $sql .= ") ORDER BY drna.idregnumerico DESC";

        $sqldata = $sql;
        $conn = Zend_Registry::get('conexion');
        $resp = $conn->execute($sql);
        $x = $resp->fetchAll(PDO::FETCH_ASSOC);
        $cantidad = count($x);

        if ($parametros['limit']) {
            $sqldata .= " LIMIT ".$parametros['limit'];
        }
        if ($parametros['start']) {
            $sqldata .= " OFFSET ".$parametros['start'];
        }
        $conn = Zend_Registry::get('conexion');
        $respdata = $conn->execute($sqldata);
        $datos = $respdata->fetchAll(PDO::FETCH_ASSOC);

        return array('datos' => $datos, 'cantidad' => $cantidad);
    }
    
    public function replicarMovrnToRn($conn, $iddocumento){
       $conn->fetchAll("SELECT * FROM \"mod_logactivofijotangible\".\"f_actualizarrnfromdoc\"($iddocumento, 'dat_movregnumericoactivotransp', 'dat_regnumericoactivotransp')");
    }
}
