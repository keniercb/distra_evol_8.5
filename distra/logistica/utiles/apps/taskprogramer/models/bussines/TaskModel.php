<?php

/**
 * Programador de tareas.
 * @class TaskModel
 * @package Logistica
 * @author Osleidy Quiala
 * @copyright (c) 2017, XETID
 * @version 1.0
 */
class TaskModel extends BaseModel
{
    private $serviceAtributo;

    public function __construct()
    {
        parent::__construct();
        $this->serviceAtributo = new AtributosdinamicosxService();
    }

    /**
     * Devuelve el listar de NomTarea.
     */
    public function cargarTask()
    {
        $query = Doctrine_Query::create()
            ->select('t.idnomtarea, t.denominacion, t.clase, t.json')
            ->from('NomTarea t')
            ->orderBy('t.idnomtarea');
        return array('datos' => $query->fetchArray(), 'cantidad' => $query->count());
    }

    public function adicionarTask($params)
    {
        if (isset($params['idnomtarea'])) {
            $tarea = Doctrine::getTable('NomTarea')->find(
                $params['idnomtarea']
            );
        } else {
            $tarea = new NomTarea();
        }
        $tarea->denominacion = $params['denominacion'];
        $tarea->clase = $params['clase'];
        $tarea->json = $params['json'];
        $tarea->save();
        return array('idnomtarea' => $tarea->idnomtarea);
    }

    public function eliminarTask($params)
    {
        Doctrine_Query::create()->delete('NomTarea')->whereIn(
            'idnomtarea ', $params
        )->execute();
    }

    public function savePropiedades($params)
    {
        $json = $this->serviceAtributo->getAtribPropiedades($params);
        $tarea = Doctrine::getTable('NomTarea')->find(
            $params['datoref']
        );
        $tarea->json = $json;
        $tarea->save();
    }
}
