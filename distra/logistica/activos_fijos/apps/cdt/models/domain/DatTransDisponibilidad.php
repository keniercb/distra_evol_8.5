<?php

class DatTransDisponibilidad extends BaseDatTransDisponibilidad
{

    private $tripulacion;

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatRegnumericoActivo', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico')
        );
        $this->hasOne(
            'NomEstatusoperativo', array('local' => 'idestatusoperativo',
            'foreign' => 'idestatusoperativo')
        );
        $this->hasOne(
            'DatTransTripulacion', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico')
        );
        $this->hasOne(
            'DatDatosEspTransDisponibilidad', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico')
        );
        $this->hasMany(
            'NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );

        $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatTransDisponibilidad',
            'properties' => array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
        LogisticaDoctrineHelper::__init()->tryInyectRelactions(new DatRegnumericoActivo(), $relations);


    }

    private function GetSelect($alias = 'd', $concatSelect = '')
    {
        return "
                {$alias}.idregnumerico as idregnumerico{$concatSelect},
                {$alias}.idestatusoperativo as idestatusoperativo{$concatSelect},
                {$alias}.idindicador as idindicador{$concatSelect},
                {$alias}.descripcion as descripcion{$concatSelect}
        ";
    }

    private function GetWhere($parametros, $query = false)
    {
        if (!$query) {
            $query = new Doctrine_Query();
        }

        if ($parametros['idregnumerico']) {
            $query->addWhere('idregnumerico = ?', $parametros['idregnumerico']);
        }

        if ($parametros['idestatusoperativo']) {
            $query->addWhere(
                'idestatusoperativo = ?', $parametros['idestatusoperativo']
            );
        }

        if ($parametros['descripcion']) {
            $query->addWhere(
                "descripcion iLike '%{$parametros['descripcion']}%''"
            );
        }


        return $query;
    }

    public function GetSubStatusAsignado($idregnumerico)
    {
        $query = new Doctrine_Query();

        return $query->from('DatTransDisponibilidad')->where(
                'idregnumerico = ?', array($idregnumerico)
            )->fetchArray();
    }

    public function GetCantMediosSubStatusDisponibles($descendencia)
    {
        $query = new Doctrine_Query();

        $parametros = array();
        $parametros['disponible'] = 1;
        $parametros['transporte'] = 1;
        $parametros['operativo'] = 1;

        // Busco los medios que esten que tengan estatus operativos configurados
        $query->from('DatTransDisponibilidad td')->whereIn(
            'idindicador', $descendencia
        );

        $query = ZendExt_IoC::getInstance(
            )->activos_fijos->GetQueryRegistroNumericoAprobadoConProducto(
            $query, 'td', 'rna', $parametros
        );


        return $query->count();
    }

    public function GetRegNumericosDisponibles($parametros = array())
    {
        $query = new Doctrine_Query();

        $query->select('td.idestatusoperativo');
        $query->from('DatTransDisponibilidad td');

        if ($parametros['limit']) {
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }
        return $query->fetchArray();
    }

    public function GetTransDisponibilidad($parametros)
    {
        $query = self::GetWhere($parametros);
        $query->from('DatTransDisponibilidad d');

        return $query->fetchArray();
    }

    public function actualizarDisponibilidad($parametros)
    {
        $observaciones = $parametros['observaciones'];
        $iddocumento = $parametros['iddocumento'];


        $sql = "SELECT COUNT(*) 
                FROM mod_logistica.dat_movimiento dm
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico dmrn ON dm.idmovimiento = dmrn.idmovimiento
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo dmrna 
                                                        ON dmrn.idmovregnumerico = dmrna.idmovregnumerico
                INNER JOIN mod_logactivofijotangible.dat_estatustecnicoestatusoperativo eteo 
                                                        ON dmrna.idestatustecnico = eteo.idestatustecnico
                WHERE eteo.pordefecto = 1 AND dm.iddocumento = $iddocumento AND dmrn.idregnumerico
                NOT IN (
                    SELECT dt.idregnumerico FROM mod_logactivofijotangible.dat_transdisponibilidad dt
                    INNER JOIN mod_logactivofijotangible.dat_movregnumerico dmrn2 ON dt.idregnumerico = dmrn2.idregnumerico
                    INNER JOIN mod_logistica.dat_movimiento dm2 ON dmrn2.idmovimiento = dm2.idmovimiento
                    WHERE dm2.iddocumento = $iddocumento)
                ";


        $conn = Zend_Registry::get('conexion');
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        //$query = $conn->prepare($sql);
        //print_r($datos);

        $sql = "SELECT COUNT(*) 
                FROM mod_logistica.dat_movimiento dm
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico dmrn ON dm.idmovimiento = dmrn.idmovimiento
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo dmrna 
                                                        ON dmrn.idmovregnumerico = dmrna.idmovregnumerico
                WHERE dm.iddocumento = $iddocumento AND dmrn.idregnumerico
                NOT IN (
                    SELECT dt.idregnumerico FROM mod_logactivofijotangible.dat_transdisponibilidad dt
                    INNER JOIN mod_logactivofijotangible.dat_movregnumerico dmrn2 ON dt.idregnumerico = dmrn2.idregnumerico
                    INNER JOIN mod_logistica.dat_movimiento dm2 ON dmrn2.idmovimiento = dm2.idmovimiento
                    WHERE dm2.iddocumento = $iddocumento)
                ";

        $conn = Zend_Registry::get('conexion');
        $datos1 = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        if($datos[0]['count'] <  $datos1[0]['count']){
            throw new ZendExt_Exception('LOG_AFT_DOC_012');
        }

        $sql1 = "
                INSERT INTO mod_logactivofijotangible.dat_transdisponibilidad (idestatusoperativo, idindicador, 
                idregnumerico, descripcion)
                SELECT (SELECT eo.idestatusoperativo
                    FROM mod_logactivofijotangible.nom_estatusoperativo eo
                    INNER JOIN mod_logactivofijotangible.dat_estatustecnicoestatusoperativo	r ON 
                    eo.idestatusoperativo = r.idestatusoperativo
                    WHERE r.idestatustecnico = dmra.idestatustecnico AND r.pordefecto = 1) AS idestatusoperativo,
                    i.idindicador, dmrn.idregnumerico, '$observaciones' AS descripcion 
                        FROM mod_logactivofijotangible.dat_movregnumericoactivo dmra
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico dmrn ON dmra.idmovregnumerico = dmrn.idmovregnumerico
                INNER JOIN mod_logistica.dat_movimiento dm ON dmrn.idmovimiento = dm.idmovimiento
                INNER JOIN mod_logistica.dat_producto p ON p.idproducto = dm.idproducto
                INNER JOIN mod_datosmaestros.nom_indicador i ON p.idindicador = i.idindicador
                /*AND i.idnaturaleza IN (SELECT idnaturaleza FROM mod_logactivofijotangible.dat_transdisponibilidad)*/
                WHERE dm.iddocumento = $iddocumento AND dmrn.idregnumerico
                NOT IN (
                    SELECT dt.idregnumerico FROM mod_logactivofijotangible.dat_transdisponibilidad dt
                    INNER JOIN mod_logactivofijotangible.dat_movregnumerico dmrn2 ON dt.idregnumerico = dmrn2.idregnumerico
                    INNER JOIN mod_logistica.dat_movimiento dm2 ON dmrn2.idmovimiento = dm2.idmovimiento
                    WHERE dm2.iddocumento = $iddocumento)";

        $sql2 = "
                UPDATE mod_logactivofijotangible.dat_transdisponibilidad dt
                SET idestatusoperativo = t.idestatusoperativo, descripcion = '$observaciones'
                FROM (
                 SELECT
                    (SELECT eo.idestatusoperativo
                        FROM mod_logactivofijotangible.nom_estatusoperativo eo
                        INNER JOIN mod_logactivofijotangible.dat_estatustecnicoestatusoperativo r ON
                        eo.idestatusoperativo = r.idestatusoperativo
                        WHERE r.idestatustecnico = dmra.idestatustecnico AND r.pordefecto = 1 ) AS idestatusoperativo,

                   dmrn.idregnumerico AS idregn FROM mod_logactivofijotangible.dat_movregnumericoactivo dmra
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico dmrn ON dmra.idmovregnumerico = dmrn.idmovregnumerico
                INNER JOIN mod_logistica.dat_movimiento dm ON dmrn.idmovimiento = dm.idmovimiento
                INNER JOIN mod_logistica.dat_producto p ON p.idproducto = dm.idproducto
                INNER JOIN mod_datosmaestros.nom_indicador i ON p.idindicador = i.idindicador
                /*AND i.idnaturaleza IN (SELECT idnaturaleza FROM mod_logactivofijotangible.dat_transdisponibilidad)*/
                WHERE dm.iddocumento = $iddocumento ) AS t
                WHERE t.idregn = dt.idregnumerico ";

        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql1);
        $query->execute();
        $query = $conn->prepare($sql2);
        $query->execute();

        return true;
    }

}
