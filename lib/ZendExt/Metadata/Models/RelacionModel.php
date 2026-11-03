<?php

class ZendExt_Metadata_Models_RelacionModel extends ZendExt_Model
{

    private $_manager;
    private $_module;
    private $_campo_model;

    public function __construct()
    {
        parent :: ZendExt_Model();
        $this->_manager = new ZendExt_Metadata_Sql_Manager();

        $doctrineManager = Doctrine_Manager::getInstance();
        $this->_module = $doctrineManager->getConnectionName($this->conn);
    }

    function cargarRelaciones($idtable)
    {
        $q = Doctrine_Query :: create();

        return $q->select(
            'r.actualizarcascada,r.eliminarcascada,
                            d.idcampo as idcdestino,d.denominacion as campodestino,
                            o.idcampo as idcorigen,o.denominacion as campoorigen,
                            t.tabla as tdestino,to.tabla as torigen,to.idtabla as idtorigen'
        )
            ->from('DatRelacion r')
            ->innerJoin('r.Destino d')
            ->innerJoin('r.Origen o')
            ->innerJoin('d.DatTabla t')
            ->innerJoin('o.DatTabla to')
            ->where('t.idtabla = ? OR to.idtabla = ?', array($idtable, $idtable))
            ->execute()
            ->toArray(true);
    }

    function contarRelaciones()
    {
        $q = Doctrine_Query :: create();
        return $q->select('COUNT(campodestino) as total')->from('DatRelacion r')->execute()->getFirst()->total;
    }

    function crearRelacion($pSource, $pTarget, $pActulizar, $pEliminar, $fk = null)
    {
        $relacion = new DatRelacion ();
        $relacion->campoorigen = $pSource;
        $relacion->campodestino = $pTarget;
        $relacion->eliminarcascada = $pEliminar;
        $relacion->actualizarcascada = $pActulizar;
        $relacion->save();
        if ($fk == null || $fk === 0) {
            $tableDestino = $relacion->Destino->DatTabla;
            $tableOrigen = $relacion->Origen->DatTabla;
            $destinoNombre = substr($tableDestino->tabla, 4, strlen($tableDestino->tabla));
            $origenNombre = substr($tableOrigen->tabla, 4, strlen($tableOrigen->tabla));
            $fk = implode('_', array('fk', $destinoNombre, $origenNombre, $pTarget));
            /*print_r($foreignkey);
            print_r($table->tabla);
            $lastforeignk = explode("fk_" . $table->tabla, $foreignkey[0]['max']);
           print_r($lastforeignk);die;
            $fkname = ($foreignkey)?("fk_" . $table->tabla . $puntero) : "fk_" . $table->tabla;*/
        }

        $this->_manager->crearRelacion($relacion, $fk);
    }

    public function relacionarTablas($esquemaorigen, $tablaorigen, $idtabladestino, $actualizar = 1, $eliminar = 1)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');

        $tabla_origen = DatTabla :: existeTabla($esquemaorigen, $tablaorigen);
        $campo_origen = DatCampo :: obtenerLLavePrimaria($tabla_origen->idtabla);

        if ($campo_origen) {
            $this->_campo_model = new ZendExt_Metadata_Models_CampoModel();
            $campo_destino = $this->_campo_model->adicionarCampo(
                $campo_origen->denominacion, $idtabladestino, 1, 0, 19, null, 0, 0, false
            );

            $this->crearRelacion($campo_origen->idcampo, $campo_destino->idcampo, $actualizar, $eliminar, 0);
        }

        $this->_manager->setCurrentConnection($this->_module);
        return true;
    }

}
