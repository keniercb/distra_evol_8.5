<?php

class NomClasificacionReporteModel extends ZendExt_Model
{
    private $nomclasificacion;

    public function __construct()
    {
        $this->nomclasificacion = new NomClasificacionReporte();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function listarClasificacion($params)
    {
        try {
            $query = new Doctrine_Query ();
            if ($params['start']) $query->offset($params['start']);
            if ($params['limit']) $query->limit($params ['limit']);

            $query->from('NomClasificacionReporte')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY);

            $temp = $query->getSqlQuery();

            $res ['data'] = $query->execute();
            $res ['total'] = $query->count();
            return $res;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function adicionarClasificacion($params)
    {
        $result = self::validarParametrosObligatorios($params);
        if ($result == 1) {
            extract($params);
            try {
                $this->nomclasificacion->denominacion = $denominacion;
                $this->nomclasificacion->save();
                return 1;  //ok
            } catch (Exception $e) {
                echo($e->getMessage());
                return -1; //error
            }
        } else return $result; //campos obligatorios vacios
    }

    public function modificarClasificacion($params)
    {
        $result = self::validarParametrosObligatorios($params);
        if ($result == 1) {
            extract($params);
            try {
                $nomclasificacion = Doctrine::getTable('NomClasificacionReporte')->find($idclasificacion);
                if (isset($nomclasificacion->idclasificacion)) {
                    $nomclasificacion->denominacion = $denominacion;
                    $nomclasificacion->save();
                    return 1;  //ok
                } else return 2; //no existe clasificacion
            } catch (Exception $e) {
                return -1; //error
            }
        } else return $result; //campos obligatorios vacios
    }

    public function validarParametrosObligatorios($params)
    {
        extract($params);
        if (empty($denominacion)) {
            return 3; //campos obligatorios vacios
        } else return 1;
    }

    public function eliminarClasificacion($arrayidclasificacion)
    {
        $noexiste = 0;
        $puedeeliminar = true;
        try {
            foreach ($arrayidclasificacion as $idclasificacion) {
                $objreporte = Doctrine::getTable('DatReporte')->findByDql(
                    "idclasificacion = '$idclasificacion'"
                );
                if (!empty($objreporte[0]->idreporte)) {
                    $puedeeliminar = false;
                } else {
                    $objelemento = Doctrine::getTable('NomClasificacionReporte')->find(
                        $idclasificacion
                    );
                    if (isset($objelemento->idclasificacion)) $objelemento->delete();
                    else $noexiste++;
                }
            }
        } catch (Exception $e) {
            $noexiste++;
        }
        $cant = count($arrayidclasificacion);
        if ($cant == 1) {
            if (!$puedeeliminar) $mensaje = -1; //mensaje: existen reportes configurados
            else if ($noexiste) $mensaje = 0; //mensaje :el elemento no existe en el registro
            else $mensaje = 1; //mensaje :elemento eliminado correctamente
        }
        if ($cant > 1) {
            if (!$noexiste && $puedeeliminar) $mensaje = 1; // mensaje :elementos eliminados correctamente
            else if ($noexiste == $cant) $mensaje = 0; //los elementos no existen en el registro
            else if (!$puedeeliminar) $mensaje = -1; //mensaje: existen reportes configurados
            else $mensaje = 2; //algunos elementos no fueron eliminados
        }
        return $mensaje;
    }

    public function obtenerClasificacionDadoId($idclasificacion)
    {
        if (!empty($idclasificacion)) {
            $result = $this->nomclasificacion->obtenerClasificacionDadoId($idclasificacion);
            if (isset($result['idclasificacion'])) {
                return $result;
            } else return 0; //no se encuentra la clasificacion
        } else return 2; //falta id clasificacion

    }

}

//fin clase
