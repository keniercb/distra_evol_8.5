<?php

class DatEstandarCodigoBarras extends BaseDatEstandarCodigoBarras
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatEstandarCodigoBarrasEstructura', array('local' => 'idestandarcodigobarra', 'foreign' => 'idestandarcodigobarra'));
    }

    public static function cargar($params)
    {
        $idEstructura = 0;
        if ($params['idestructura']) {
            $idEstructura = $params['idestructura'];
        }
        
        $conn = Zend_Registry::get('conexion');
        $select = "SELECT esc.*, coalesce(esq.secuenciaactual, 0) as secuenciaactual, count(*) over() as cantidad";
        $from = "
        FROM mod_datosmaestros.dat_estandarcodigobarras esc
        left join mod_datosmaestros.dat_estandarcodigobarras_estructuraseq esq 
        on esc.idestandarcodigobarra = esq.idestandarcodigobarra
        and case when esc.sequenciaporentidad 
        then esq.idestructura = $idEstructura
        else esq.idestructura is null end
        ";
        $where = "";
        $orderby = "order by esc.idestandarcodigobarra";
        $limit = "";
        if ($params['limit']) {
            $limit .= "LIMIT {$params['limit']} ";
        }
        if ($params['start']) {
            $limit .= "OFFSET {$params['start']}";
        }

        $result = $conn->fetchAll("
        $select
        $from
        $where
        $orderby
        $limit
        ");
        return $result;
    }

    static public function eliminar($id)
    {
        $obj = Doctrine::getTable('DatEstandarCodigoBarras')->find($id);
        $seqEliminar = $obj->DatEstandarCodigoBarrasEstructura->toArray();
        $obj->delete();
        foreach ($seqEliminar as $key => $value) {
            self::eliminarSequenciaEstandarCodigoBarras(
                $value['idestandarcodigobarra'],
                $value['idestructura']
            );
        }
        return true;
    }

    public static function getById($id)
    {
        $obj = Doctrine::getTable('DatEstandarCodigoBarras')
            ->find($id);
        $arr = $obj->toArray();
        return !empty($arr) ? $arr : null;
    }

    public static function actualizarSequenciaTabla($idestandarcodigobarra, $idEstructura, $numero = 1)
    {
        if ($idEstructura) {
            $estructuraText = "= $idEstructura";
        } else {
            $estructuraText = "is null";
        }
        $obj = Doctrine::getTable('DatEstandarCodigoBarrasEstructura')
            ->findBySql('idestandarcodigobarra = ? and idestructura ' . $estructuraText, [$idestandarcodigobarra]);
        if ($obj->count() > 0) {
            $obj[0]->secuenciaactual = $numero;
            $obj->save();
        } else {
            $obj = new DatEstandarCodigoBarrasEstructura;
            $obj->idestandarcodigobarra = $idestandarcodigobarra;
            $obj->secuenciaactual = $numero;
            if ($idEstructura) {
                $obj->idestructura = $idEstructura;
            }
            $obj->save();
        }
        return $obj->toArray();
    }

    public static function saveObj($objEstandar)
    {
        try {
            if ($objEstandar->idestandarcodigobarra) {
                $obj = Doctrine::getTable('DatEstandarCodigoBarras')
                    ->find($objEstandar->idestandarcodigobarra);
            }
            else {
                $obj = new DatEstandarCodigoBarras();
            }

            if ($objEstandar->denominacion) {
                $obj->denominacion = $objEstandar->denominacion;
            }
            if ($objEstandar->bandera) {
                $obj->bandera = $objEstandar->bandera;
            }
            if ($objEstandar->formato) {
                $obj->formato = $objEstandar->formato;
            }
            if (is_numeric($objEstandar->sequenciaporentidad)) {
                $obj->sequenciaporentidad = true;
            } else {
                $obj->sequenciaporentidad = false;
            }

            $obj->save();
            return $obj->idestandarcodigobarra;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function crearSequenciaEstandarCodigoBarras($idestandarcodigobarra, $tamanno, $idEstructura)
    {
        if (is_numeric($idestandarcodigobarra) && $tamanno > 0) {
            if ($idEstructura) {
                $nombre = $idestandarcodigobarra . '_' . $idEstructura;
            } else {
                $nombre = $idestandarcodigobarra;
            }
            $conn = Zend_Registry::get('conexion');
            $conn->execute("
                select mod_datosmaestros.f_crear_sequencia_codigo_barra(
					{$idestandarcodigobarra},
					{$idEstructura},
					{$tamanno}
				)
            ");
            return true;
        }
        return false;
    }

    static public function existeSequenciaEstandarCodigoBarras($idestandarcodigobarra, $idEstructura)
    {
        if ($idEstructura) {
            $nombre = $idestandarcodigobarra . '_' . $idEstructura;
        } else {
            $nombre = $idestandarcodigobarra;
        }
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll("
            SELECT 0 
            FROM pg_class 
            where relname = 'sec_estandarcodigobarras_{$nombre}_seq'
        ");
        return count($result) > 0;
    }

    static public function nextValueSequenciaEstandarCodigoBarras($idestandarcodigobarra, $idEstructura)
    {
        if ($idEstructura) {
            $nombre = $idestandarcodigobarra . '_' . $idEstructura;
        } else {
            $nombre = $idestandarcodigobarra;
        }
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll("
            select nextval('sec_estandarcodigobarras_{$nombre}_seq') as next
        ");
        self::actualizarSequenciaTabla($idestandarcodigobarra, $idEstructura, $result[0]['next']);
        return $result[0]['next'];
    }

    static public function eliminarSequenciaEstandarCodigoBarras($idestandarcodigobarra, $idEstructura)
    {
        if (is_numeric($idestandarcodigobarra)) {
            if ($idEstructura) {
                $nombre = $idestandarcodigobarra . '_' . $idEstructura;
                $estructuraText = "= $idEstructura";
            } else {
                $nombre = $idestandarcodigobarra;
                $estructuraText = "is null";
            }

            $obj = Doctrine::getTable('DatEstandarCodigoBarrasEstructura')
                ->findBySql('idestandarcodigobarra = ? and idestructura ' . $estructuraText, [$idestandarcodigobarra]);
            if ($obj->count() > 0) {
                $obj->delete();
            }
                
            $conn = Zend_Registry::get('conexion');
            $conn->execute("
                DROP SEQUENCE mod_datosmaestros.sec_estandarcodigobarras_{$nombre}_seq
            ");
            return true;
        }
        return false;
    }

    static public function setearSequenciaEstandarCodigoBarras($idestandarcodigobarra, $idEstructura, $numero)
    {
        if (is_numeric($idestandarcodigobarra) && is_numeric($numero)) {
            $nombreSeq = self::getNameSequence($idestandarcodigobarra, $idEstructura);
            $conn = Zend_Registry::get('conexion');
            $conn->execute("
            select setval('$nombreSeq', $numero, false)
            ");
            return true;
        }
        return false;
    }

    public static function crearEstandareCodigoBarraDefault()
    {
        $conn = Zend_Registry::get('conexion');

        $establecimiento = "('Código de establecimiento', '20', 'AAAT999999X', false)";
        $pesovariable = "('Código de peso variable', '26', '9999000000X', false)";
        $servicio = "('Código de servicio', '29', 'SS99999999X', true)";
        $gastronomia = "('Código de gastronomia', '21', 'SS99999999X', true)";
        $local = "('Código de local', '22', 'SS99999999X', true)";
        $ocasion = "('Código de ocasion', '23', 'SS99999999X', true)";

        $result = $conn->fetchAll("
        INSERT INTO mod_datosmaestros.dat_estandarcodigobarras(
            denominacion, bandera, formato, sequenciaporentidad)
            VALUES 
            $establecimiento,
            $pesovariable,
            $servicio,
            $gastronomia,
            $local,
            $ocasion
            returning *
            ;
        ");

        return $result;
    }

    static public function getNameSequence($idestandarcodigobarra, $idEstructura)
    {
        if ($idEstructura) {
            $nombre = $idestandarcodigobarra . '_' . $idEstructura;
        } else {
            $nombre = $idestandarcodigobarra;
        }
        return "sec_estandarcodigobarras_{$nombre}_seq";
    }

}