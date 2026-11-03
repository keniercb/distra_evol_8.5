<?php

/**
 *  Gerardo
 */
class RegNumericoModel extends AbstractCompositeModel
{

    /**
     *
     */
    public function __construct()
    {
        parent::__construct();
        $this->primaryKeyField = "idregnumerico";
        $this->initRelations();
    }

    /**
     *
     */
    public function initRelations()
    {
        $relations = array();
        array_push(
            $relations,
            array(
            'cardinalidad' => 'many',
            'relation' => 'DatRegnumerico',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
            )
        );
        $this->doctrineHelper->tryInyectRelactions(new DatProductoLogistica, $relations);
    }

    /**
     *
     */
    protected function getWhere($query, $alias, $parametros)
    {
        if (!$query) {
            $query = new Doctrine_Query();
        }

        if ($parametros['idregnumerico']) {
            $query->addWhere("$alias.idregnumerico = ?", array($parametros['idregnumerico']));
        }

        if ($parametros['nroserie']) {
            $query->addWhere("{$alias}.nroserie iLike '%{$parametros['nroserie']}%'");
        }

        if ($parametros['idproducto']) {
            $query->addWhere("{$alias}.idproducto = ?", array($parametros['idproducto']));
        }

        if ($parametros['idsRegNumNoMostrar'] && count($parametros['idsRegNumNoMostrar'])) {
            $query->andWhereNotIn("{$alias}.idregnumerico", $parametros['idsRegNumNoMostrar']);
        }

        if ($parametros['idsRegNumMostrar'] && count($parametros['idsRegNumMostrar'])) {
            $query->andWhereIn("{$alias}.idregnumerico", $parametros['idsRegNumMostrar']);
        }

        if ($parametros['limit']) {
            ComunAFTModel::getInstance()->configStartAndLimitInParams(
                $parametros, $parametros['start'], $parametros['limit']
            );

            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }

        return $query;
    }

    /**
     *
     */
    public function initBaseModel()
    {
        $this->baseModel = new DatRegnumerico();
    }

    /**
     *
     */
    public function initBaseRelation(Doctrine_Record $model)
    {
        
    }

    /**
     *
     */
    public function addJoinModel(
    Doctrine_Query $query, $aliasExterno, $aliasLocal = 'rn', $includeSelect = true, $parametros = array(), $join = 1
    )
    {
        if ($join == 1) {
            $query->innerJoin("{$aliasExterno}.DatRegnumerico {$aliasLocal}");
        } else {
            $query->leftJoin("{$aliasExterno}.DatRegnumerico {$aliasLocal}");
        }

        if ($includeSelect) {
            $query->addSelect($this->getQuerySelectFields($aliasLocal));
        }

        if (count($parametros)) {
            $this->getWhere($query, $aliasLocal, $parametros);
        }

        return $query;
    }

    /**
     *
     */
    public function addQueryFilters(Doctrine_Query $query, $aliasTabla, $parametros = array())
    {
       
    }

    /**
     *
     */
    public function getQuerySelectFields($alias)
    {
        return "
            {$alias}.idregnumerico as idregnumerico,
            {$alias}.idproducto as idproducto,
            {$alias}.nroserie as nroserie
        ";
    }

    /**
     *
     */
    public function beforeDelete($parametros)
    {
        
    }

    /**
     * @param array $datos  En este arreglo solo deben venir los datos datos que han sido mofificados,
     *                      es decir: grid.getSelectionModel().getSelected().getChanges() y en caso de una
     *                      modificacion debe venir idregnumrico y el idmovregnumerico
     *
     * @return DatRegnumerico
     */
    public function crearObjRegNumerico(array $datos)
    {
        $cDatMovRegnumerico = 'DatMovRegnumerico';
        if ($datos['idregnumerico']) {
            $regNumerico = Doctrine::getTable('DatRegnumerico')->find($datos['idregnumerico']);
        } else {
            $regNumerico = new DatRegnumerico();
        }

        if ($datos['idmovregnumerico']) {
            $movRegNumerico = Doctrine::getTable('DatMovRegnumerico')->find(
                $datos['idmovregnumerico']
            );
        } else {
            $movRegNumerico = new DatMovRegnumerico();
        }

        $regNumerico->synchronizeWithArray($datos);
        $movRegNumerico->synchronizeWithArray($datos);

        $regNumerico->$cDatMovRegnumerico->add($movRegNumerico);

        return $regNumerico;
    }

    /**
     *
     */
    public function eliminarSerieEntrada($idRegNumerico, $idMovRegNumerico, $recepeliminar = false)
    {
        $query = new Doctrine_Query();

        $cantMovimientos = $query->from('DatMovRegnumerico mrn')
            ->where('mrn.idregnumerico = ?', array($idRegNumerico))
            ->count();

        /**
         * En caso de que solamente tenga un movimiento se elimina tambien el registro numérico
         * con el movimiento del registro numérico
         */
        if ($cantMovimientos == 1) {
            $query = new Doctrine_Query();
            $query->delete()
                ->from('DatRegnumerico rn')
                ->where('rn.idregnumerico = ?', array($idRegNumerico))
                ->execute();
        } else {
            if($recepeliminar){
                // En caso de que sea un doc de recepcion hay que actualizar el idarearesp en regnumericoactivo
                $global = ZendExt_GlobalConcept::getInstance();
                $estructura = 'Estructura';
                $idestructuraop = $global->$estructura->idestructura;
                $regnum = Doctrine::getTable('DatRegnumericoActivo')->find($idRegNumerico);
                $regnum->idarearesp = $idestructuraop;

                // Esto es para conocer que el registro esta siendo usado en un documento que no esta aprobado.
                $regnum->DatRegnumerico->enproceso = 0;

                $regnum->save();
            }else{
                $regnum = Doctrine::getTable('DatRegnumerico')->find($idRegNumerico);
                // Esto es para conocer que el registro esta siendo usado en un documento que no esta aprobado.
                $regnum->enproceso = 0;
                $regnum->save();
            }

            //En caso de que tenga mas de un movimiento solamente el movimiento del registro numérico
            $query = new Doctrine_Query();
            $query->delete()
                ->from('DatMovRegnumerico mrn')
                ->where('mrn.idmovregnumerico = ?', array($idMovRegNumerico))
                ->execute();
        }
    }

    /**
     *
     */
    public function getQueryRegNumerico($asLoc = 'rn', $select = false, $parametros = array())
    {
        $query = new Doctrine_Query();
        $query->from("DatRegnumerico {$asLoc}");

        if ($select) {
            $query->addSelect($this->getQuerySelectFields($asLoc));
        }

        if (count($parametros)) {
            $query = $this->getWhere($query, $asLoc, $parametros);
        }

        return $query;
    }

    /*
     * Se valida que no existan registros numericos insertados de los que se estan importado
     * */

    public function validarSeriesRegistrados($conn)
    {
        $buscarNroSeriesRepetidos = "
                    SELECT dimp.nroserie, count(*) as cantidad_veces_repetido
                    FROM mod_logactivofijotangible.dat_importartmp dimp
                    GROUP BY dimp.nroserie
                    HAVING count(*) > 1";
        $resp = $conn->execute($buscarNroSeriesRepetidos);
        $nroseriesRepetidos = $resp->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarRNInsertadosImportar($conn)
    {
        $nrosserieexistentes = "
           SELECT rn.nroserie
            FROM mod_logactivofijotangible.dat_registronumerico rn
            INNER JOIN mod_logactivofijotangible.dat_importartmp dimp ON rn.nroserie = dimp.nroserie
        ";
        $resp = $conn->execute($nrosserieexistentes);
        $nroseriesRepetidos = $resp->fetchAll(PDO::FETCH_ASSOC);

        return $nroseriesRepetidos;
    }

    public function actualizarEstadoEnProcesoRn($iddocumento = null, $idmovimiento = null){

        $where = "";
        if ($iddocumento) {
            $where = " m.iddocumento = $iddocumento";
        } else if ($idmovimiento) {
            $implo = implode(',',$idmovimiento);
            if(is_array($idmovimiento))
                $where = " m.idmovimiento IN ($implo)";
            else
            $where = " m.idmovimiento = $idmovimiento";
        }
        if ($where != "") {
            $query = new Doctrine_Query();
            $query->update('DatRegnumerico')
                ->set("enproceso",0)
                ->where("idregnumerico IN (
                SELECT mrn.idregnumerico 
                FROM DatMovRegnumerico mrn
                INNER JOIN mrn.DatMovimientos m ON m.idmovimiento = mrn.idmovimiento
                WHERE $where
            )")
                ->execute();
        }

    }

    public function getActivosWinService($params){

        $conn = Zend_Registry::get('conexion');

        $start = 0;
        $limit = 20;
        if($params['start'] >= 0 && $params['limit'] >= 0 ){
            $start = $params['start'];
            $limit = $params['limit'];
        }

        $global = ZendExt_GlobalConcept::getInstance();
        $estructura = 'Estructura';
        $idestructura = $global->$estructura->idestructura;


        $select = "SELECT 
                COALESCE(de.denominacion, deop.denominacion) as estructura,
                nf_entidad.idfila as idestructura,
                eop_area.denominacion as arearesp,
                ni.denominacion as denominacion,
                ni.codigo as codigo,
                ni.idindicador,
                ni.idnaturaleza,
                nih.idgruposubgrupo,
                ncc.concat as centrocosto,
                drna.idcentrocosto as idcentrocosto,
                (person.nombre || ' ' || person.papel || ' ' || person.sapel) as responsable,                
                drna.nroinventario,
                drna.idregnumerico
                
        ";
        $from = " FROM mod_logactivofijotangible.dat_registronumerico drn
                INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idregnumerico = drn.idregnumerico
                INNER JOIN mod_logistica.dat_producto p on p.idproducto = drn.idproducto
                INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = p.idindicador
                INNER JOIN mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
                
                INNER JOIN mod_estructuracomp.nom_filaestruc nf_entidad on nf_entidad.idfila = p.idestructura
                LEFT JOIN mod_estructuracomp.dat_estructura de on de.idestructura = nf_entidad.idfila
                LEFT JOIN mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = nf_entidad.idfila
                
                INNER JOIN mod_estructuracomp.dat_estructuraop eop_area on eop_area.idestructuraop = drna.idarearesp
                
                LEFT JOIN mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = drna.idcentrocosto
                LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = drna.idresponsable
                LEFT JOIN mod_persona.dat_persona person on person.idpersona = resp.idpersona
                                                                
                ";
        $where = " WHERE p.idestructuracomun = {$idestructura} AND drna.idestadoperacion NOT IN (0,7,6) AND ni.idnaturaleza <> -5 ";

        if(count($params['idregistrosExcluir']) > 0){
            $idsExcluir = implode(',', $params['idregistrosExcluir']);
            $where .= " AND drn.idregnumerico NOT IN ({$idsExcluir}) ";
        }

        if($params['filtrado'] == 1){
            $where .= " AND (drna.nroinventario ilike '%{$params['criterio']}%' 
                            OR ni.denominacion ilike '%{$params['criterio']}%'
                            OR ni.codigo ilike '%{$params['criterio']}%'
                        
             )";
        }

        $sql = $select . $from . $where;
        $sql .= " offset {$start} limit {$limit} ";

        $activos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);


        if($params['filtrado'] == 1){

            $colFiltroBasico = [
                'nroinventario',
                'codigo',
                'denominacion'
            ];

            $etiquetaIni = "<span style='background-color: #ffff00'>";
            $etiquetaEnd = "</span>";

            foreach ($activos as &$aft){
                foreach ($colFiltroBasico as $idxcol){
                    $pos = strpos(strtoupper($aft[$idxcol]), strtoupper($params['criterio']));
                    if($pos !== false){
                        $rpl = $etiquetaIni . substr($aft[$idxcol], $pos, strlen($params['criterio'])) . $etiquetaEnd;
                        $str = substr_replace($aft[$idxcol], $rpl, $pos, strlen($params['criterio']));
                        $aft[$idxcol] = $str;
                    }
                }
            }
        }


        return $activos;
    }

        public function obtenerResponsablesEntidad($idestructuracomun, $criterio = '', $start = 0, $limit = 30) {

                $conn = Zend_Registry::get('conexion');

                $whereCriterio = !empty($criterio) ? "
                    AND (
                        dp.nombre ILIKE :criterio OR 
                        dp.papel ILIKE :criterio OR 
                        dp.sapel ILIKE :criterio OR 
                        ddi.numero ILIKE :criterio
                    )
                " : '';
            
                $sqlCount = "
                    SELECT COUNT(DISTINCT dp.idpersona) as total 
                    FROM mod_persona.dat_persona dp
                    INNER JOIN mod_persona.dat_docidentidad ddi 
                        ON ddi.idpersona = dp.idpersona AND ddi.principal = 1
                    INNER JOIN mod_persona.dat_personaentidad pe 
                        ON dp.idpersona = pe.idpersona 
                        AND ((pe.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= pe.fhasta OR pe.fhasta IS NULL)))
                    INNER JOIN mod_persona.dat_situacionlaboral sl 
                        ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                    WHERE (sl.ueb = :ueb OR pe.identidad = :identidad)
                    {$whereCriterio}
                ";
                
                $stmtCount = $conn->prepare($sqlCount);
                $stmtCount->bindValue(':ueb', $idestructuracomun);
                $stmtCount->bindValue(':identidad', $idestructuracomun);
                if (!empty($criterio)) {
                    $stmtCount->bindValue(':criterio', "%{$criterio}%");
                }
                $stmtCount->execute();
                $total = (int)$stmtCount->fetchColumn();
            
                $sql = "
                    SELECT DISTINCT 
                        dp.idpersona,
                        ddi.numero AS numid,
                        dp.nombre,
                        dp.papel,
                        dp.sapel,
                        dp.sexo,
                        CONCAT(dp.nombre, ' ', dp.papel, ' ', dp.sapel) AS nombreyapellidos
                    FROM mod_persona.dat_persona dp
                    INNER JOIN mod_persona.dat_docidentidad ddi 
                        ON ddi.idpersona = dp.idpersona AND ddi.principal = 1
                    INNER JOIN mod_persona.dat_personaentidad pe 
                        ON dp.idpersona = pe.idpersona 
                        AND ((pe.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= pe.fhasta OR pe.fhasta IS NULL)))
                    INNER JOIN mod_persona.dat_situacionlaboral sl 
                        ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                    WHERE (sl.ueb = :ueb OR pe.identidad = :identidad)
                    {$whereCriterio}
                    ORDER BY dp.nombre
                    LIMIT :limit OFFSET :start
                ";
                
                $stmt = $conn->prepare($sql);
                $stmt->bindValue(':ueb', $idestructuracomun);
                $stmt->bindValue(':identidad', $idestructuracomun);
                if (!empty($criterio)) {
                    $stmt->bindValue(':criterio', "%{$criterio}%");
                }
                $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
                $stmt->bindValue(':start', $start, PDO::PARAM_INT);
                $stmt->execute();
                
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                return ['rows' => $rows, 'total' => $total];
            }



}
