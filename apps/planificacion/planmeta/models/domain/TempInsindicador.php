<?php

class TempInsindicador extends BaseTempInsindicador {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomDatosnomenclador', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
                'NomIndicador', array('local' => 'codigo', 'foreign' => 'codigo')
        );
    }

    public function obtenerIndincadores() {
        $query = Doctrine_Query::create();
        $query->select("n.codigo")
                ->from('TempInsindicador n');
        $result = $query->execute()->toArray();
        return $result;
    }

    public function getConcepto($start = 0, $limit = 10000, $contar = null) {
        $query = Doctrine_Query::create();
        if ($contar) {
            $query->from('TempInsindicador tin');
            return $query->select('COUNT(tin.idinsindicador) as total')
                            ->execute()->getFirst()->total;
        }
        return $query
                        ->from('TempInsindicador tin')
                        ->leftJoin('tin.NomIndicador ind')
                        ->leftJoin("ind.DatIndicadorcentrobalance e")
                        ->leftjoin('ind.DatIndicadorviaadquisicion z')
                        ->leftjoin(
                                "z.DatIndicadorviaadquisicionorganosatisface dn WITH z.idindicador = dn.idindicador"
                        )
                        ->offset($start)
                        ->limit($limit)->orderby('tin.codigo')->execute();
    }

    public function getConceptoSql(
    $iddatosnomaexcluir, $start, $limit, $nivel, $idformato, $conn, $arrayfiltros, $contar = null
    ) {
        $idesplogueada = ZendExt_GlobalConcept::getInstance(
                )->Estructura->idespecialidad;

        $array_longitud = self::getLengthNivel($conn, $idformato, $nivel);
        $lengthcod = $array_longitud[0];

        $array_longitud_padre = self::getLengthPadreNivel($conn, $idformato, $nivel);
        $lengthcodpad = $array_longitud_padre[0];


        if (is_array($arrayfiltros)) {
            foreach ($arrayfiltros as $k => $valor) {
                unset($arrayfiltros[$k]);
                $arrayfiltros[$k]['field'] = $valor->field;
                $arrayfiltros[$k]['data']['comparison'] = $valor->data->comparison;
                $arrayfiltros[$k]['data']['type'] = $valor->data->type;
                $arrayfiltros[$k]['data']['value'] = $valor->data->value;
            }
        }
        $where = DatImportarModel::SqlFiltros($arrayfiltros, "tin.");
        if ($where != '') {
            $where = "AND " . $where;
        }

        $conn = Doctrine_Manager::connection();
        if ($contar) {
            $sql = "SELECT COUNT( tin.idinsindicador ) as total
               FROM mod_planifimportacion.temp_insindicador tin ";
            $sql .= " WHERE ( tin.iddatosnomenclador is null
            OR (tin.iddatosnomenclador <> {$iddatosnomaexcluir[0]}
            AND tin.iddatosnomenclador <> {$iddatosnomaexcluir[1]} ) )
            AND tin.idespecialidad = {$idesplogueada}
            AND (char_length(tin.codigo) = {$lengthcod} {$where}
            OR tin.idnivelarbol = {$nivel} )";

            $arrayres = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            return $arrayres[0]['total'];
        }
        if ($adicionar)
            $padreTemp = " ";
        else
            $padreTemp = " (SELECT DISTINCT tinpadre.codigo   
         FROM mod_planifimportacion.temp_insindicador tinpadre 
         WHERE tinpadre.codigo = substring(tin.codigo, 1, {$lengthcodpad}) and
               length(tinpadre.codigo) = {$lengthcodpad}  and
               tin.idnivelarbol <> 1) as idpadretemp,
               
        (SELECT tinpadre.iddatosnomenclador   
         FROM mod_planifimportacion.temp_insindicador tinpadre 
         WHERE tinpadre.codigo = substring(tin.codigo, 1, {$lengthcodpad}) and
               length(tinpadre.codigo) = {$lengthcodpad}  and
               tin.idnivelarbol <> 1) as iddatosnomencladorpadre,";


        $sql = "SELECT Distinct tin.codigo,
              tin.idinsindicador,
              tin.precio,
              tin.precioventa,
              tin.numeropieza,
              tin.centrobalance,
              tin.viaadquisicion,
              tin.nivelarbol,
              tin.estado,
              tin.nivel,
              tin.naturaleza,
              tin.idumedida,
              tin.idaprobacion,
              tin.denominacion,
              tin.organosatisface,
              tin.iddatosnomenclador,
              tin.flete ,
              tin.contingencia,
              tin.pais,
              tin.idnivelarbol,
              ind.idindicador,
              ind.codigo as codigoind,
              ind.idpadre as idpadreind,
              indplanif.nivelplanif as nivelind,
              ind.nivel as nivelarbolind,
              (SELECT indicpadre.idindicador 
              FROM mod_datosmaestros.nom_indicador indicpadre 
              WHERE indicpadre.codigo = substring(tin.codigo,1,{$lengthcodpad} ) 
                and length(indicpadre.codigo) = {$lengthcodpad} 
                and tin.idnivelarbol <> 1 ) as idpadre,
                $padreTemp
              (SELECT indicpadre.idarbol
              FROM mod_datosmaestros.nom_indicador indicpadre
              WHERE indicpadre.codigo = substring(tin.codigo,1,{$lengthcodpad} )
              and length(indicpadre.codigo) = {$lengthcodpad}
              and tin.idnivelarbol <> 1 ) as idarbol

            FROM mod_planifimportacion.temp_insindicador tin
            LEFT JOIN mod_datosmaestros.nom_indicador ind            
            ON(tin.codigo = ind.codigo) 
            LEFT JOIN mod_datosmaestros.nom_indicadorplanif indplanif            
            ON(indplanif.idindicador = ind.idindicador) 
            WHERE  ( tin.iddatosnomenclador is null 
            OR ( tin.iddatosnomenclador <> {$iddatosnomaexcluir[0]} 
            AND tin.iddatosnomenclador <> {$iddatosnomaexcluir[1]} ) ) 
            AND tin.idespecialidad = {$idesplogueada}  
            AND (length(tin.codigo) = {$lengthcod} 
            OR tin.idnivelarbol = {$nivel})
            {$where}
            ORDER BY tin.codigo 
            OFFSET {$start} LIMIT {$limit}
             ";
        return $conn->execute($sql)->fetchAll(PDO::FETCH_CLASS);
    }

    public function actualizarEstado($id, $estado) {
        $obj = Doctrine::getTable('TempInsindicador')->find($id);
        $obj->iddatosnomenclador = $estado;
        $obj->save();
    }

    public function getLengthNivel($conn, $idformato, $nivel) {
        return $conn->execute("SELECT sum(pf.longitud) as long
                                    FROM mod_datosmaestros.dat_parteformato pf
                                    WHERE pf.idformato = $idformato 
                                        AND pf.nivel <= $nivel"
                )->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getNivel($conn, $idformato, $length) {
        return $conn->execute("SELECT pf.nivel as nivel, pf.nombre as nombre, pf.abreviatura as abreviatura
                                FROM mod_datosmaestros.dat_parteformato pf
                                WHERE pf.idformato = $idformato and
                                      (
                                        SELECT sum(pfs.longitud)
                                        FROM mod_datosmaestros.dat_parteformato pfs
                                        WHERE pfs.idformato = pf.idformato and
                                              pfs.nivel <= pf.nivel
                                      ) = $length"
                )->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getLengthPadreNivel($conn, $idformato, $nivel) {
        return $conn->execute("SELECT COALESCE(sum(pf.longitud),1) as long
                                    FROM mod_datosmaestros.dat_parteformato pf
                                    WHERE pf.idformato = $idformato 
                                        AND pf.nivel < $nivel"
                )->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getConceptos($start = 0, $limit = 10000, $iscount = null) {
        $query = Doctrine_Query::create();
        $query->from('TempInsindicador ia');
        if ($iscount) {
            return $query
                            ->select('COUNT(ia.idnsindicador ) as total')
                            ->execute()->getFirst()->total;
        } else {
            return $query
                            ->select('ia.*,act.*')
                            ->leftJoin('ia.NomIndicador act')
                            ->orderby('ia.codigo')
                            ->offset($start)->limit($limit)
                            ->execute();
        }
    }

    public function verifPadre() {
        $cod = array();
        $cod["len3"] = 'Generico';
        $cod["len4"] = 'Subgenerico';
        $cod["len6"] = 'Especifico';
        $cod["len10"] = 'Surtido';
        return ($cod['len' . strlen($this->codigo)] != null) ? 'ok' : 'no';
    }

}