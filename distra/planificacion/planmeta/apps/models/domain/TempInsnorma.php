<?php

class TempInsnorma extends BaseTempInsnorma {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomDatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne('NomActividad', array('local' => 'codigoact', 'foreign' => 'codigo'));
        $this->hasOne('NomIndicador', array('local' => 'codigoind', 'foreign' => 'codigo'));
    }

    public function obtenerIdentificadorNormaEnActividades() {
        $query = Doctrine_Query::create();
        $query->select("n.codigoact")
                ->from('TempInsnorma n');
        $result = $query->execute()->toArray();
        return $result;
    }

    public function obtenerIdentificadorNorma() {
        $query = Doctrine_Query::create();
        $query->from('TempInsnorma n');
        $result = $query->execute()->toArray();
        return $result;
    }

    function actualizarEstado($id, $estado) {
        $conn1 = Doctrine_Manager::connection();
        $query1 = "UPDATE 
                        mod_planifimportacion.temp_insnorma 
                      SET 
                        iddatosnomenclador = {$estado}
                      WHERE 
                        idinsnorma = {$id}";
        $conn1->execute($query1);
        return true;
    }

    function Eliminar($id) {
        $obj = Doctrine::getTable('TempInsnorma')->find($id);
        $obj->delete();
    }

    function Insertar($nuevaNorma) {
        $conn1 = Doctrine_Manager::connection();
        $query1 = "INSERT INTO 
                        mod_planificacion.dat_norma
                      (idindicador,idactividad,cantbase,cantplanif,idejercicio,idusuario)
                      VALUES (
                        {$nuevaNorma['idindicador']},
                        {$nuevaNorma['idactividad']},
                        {$nuevaNorma['cantbase']},
                        {$nuevaNorma['cantplanif']},
                        {$nuevaNorma['idejercicio']},
                        {$nuevaNorma['idusuario']}
                      )";
        $conn1->execute($query1);
        return true;
    }

    public function listarNormas($start, $limit, $parametros) {
        $query = Doctrine_Query::create();
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {
                if ($s != null) {
                    if ($p == 'umedida') {
                        $query->addWhere(
                                "upper(o.umedida)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    }
                }
            }
        }
        return $query->select(
                                'o.codigoind,o.codigoact as codact,o.umedida as um,o.cantbase as base, o.cantplanif as planif'
                        )
                        ->from('TempInsnorma o')
                        ->orderBy('o.codigo')
                        ->offset($start)
                        ->limit($limit)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function getConcepto($idesplogueada, $iddatosnomAexcluir, $start = 0, $limit = 10000, $contar = null
    ) {
        if ($contar) {
            $conn1 = Doctrine_Manager::connection();
            $query1 = "SELECT COUNT(t.idinsnorma) as total
                 FROM mod_planifimportacion.temp_insnorma t
                 WHERE (t.iddatosnomenclador is null OR
                       ((t.iddatosnomenclador <> {$iddatosnomAexcluir[0]} AND
                       t.iddatosnomenclador <> {$iddatosnomAexcluir[1]}) AND
                       t.idespecialidad = {$idesplogueada}))";

            $data = $conn1->execute($query1)
                    ->fetchAll(PDO::FETCH_COLUMN);
            return $data;
        }

        $idejercicio = NomEjercicioplanificacion:: listarEjercicioActual();

        $conn2 = Doctrine_Manager::connection();
        $query2 = "SELECT t.idinsnorma,
                            t.codigoact,
                            t.codigoind,
                            t.cantbase,
                            t.cantplanif,
                            t.iddatosnomenclador,
                            t.idespecialidad,
                            a.idactividad,
                            a.estado as estadoact,
                            a.idaprobacion as idaprobacionact,
                            ind.idindicador,
                            ind.estado as estadoind,
                            ind.activo as activoind,
                            indp.idindicador as idindicadorplanif,
                            indp.nivelplanif,
                            indp.idaprobacion as idaprobacionplanif,
                            dn.idnorma,
                            dn.idejercicio
                 FROM mod_planifimportacion.temp_insnorma t
                      LEFT JOIN mod_planificacion.nom_actividad a ON t.codigoact = a.codigo
                      LEFT JOIN mod_datosmaestros.nom_indicador ind ON t.codigoind = ind.codigo                      
                      LEFT JOIN mod_planificacion.dat_norma dn ON dn.idactividad = a.idactividad AND dn.idindicador=ind.idindicador AND dn.idejercicio = {$idejercicio[0]['idejercicio']}
                      LEFT JOIN mod_datosmaestros.nom_indicadorplanif indp ON ind.idindicador =
                        indp.idindicador
                 WHERE (t.iddatosnomenclador is null OR
                       ((t.iddatosnomenclador <> {$iddatosnomAexcluir[0]} AND
                       t.iddatosnomenclador <> {$iddatosnomAexcluir[1]}) AND
                       t.idespecialidad = {$idesplogueada}))
                       
                 OFFSET {$start} LIMIT {$limit}";
        $data = $conn2->execute($query2)
                ->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
