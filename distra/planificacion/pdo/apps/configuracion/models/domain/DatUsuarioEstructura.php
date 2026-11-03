<?php

/**
 * @author    Jes�s Ariel Guerra L�pez
 * @version   3.0.0
 * @copyright XETID
 */
class DatUsuarioEstructura extends BaseDatUsuarioEstructura
{
    public function setUp()
    {
        parent::setUp();
    }

    public function obtenerUserEstructura($idusuario)
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            'due.idusuario,due.idestructura,due.fechaasociacion,due.autor'
        )
            ->from('DatUsuarioEstructura due')
            ->where('due.idusuario = ?', $idusuario)
            ->execute();
        return $result->toArray();
    }

    public function obtenerEstructuraUser($idestructura)
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            'due.idusuario,due.idestructura,due.fechaasociacion,due.autor'
        )
            ->from('DatUsuarioEstructura due')
            ->where('due.idestructura = ?', $idestructura)
            ->execute();
        return $result->toArray();
    }

    public function obtenerRelacionesAutor($idautor)
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            'due.idusuario,due.idestructura,due.fechaasociacion,due.autor'
        )
            ->from('DatUsuarioEstructura due')
            ->where('due.autor = ?', $idautor)
            ->execute();
        return $result->toArray();
    }

    public function actualizarUserEstrc($parametros)
    {
        $query = new Doctrine_Query();
       /* $res = */$query->update('DatUsuarioEstructura due')
            ->set('due.idusuario', '?', $parametros['idusuario'])
            ->set('due.idestructura', '?', $parametros['idestructura'])
            ->set('due.fechaasociacion', '?', $parametros['fecha_actual'])
            ->set('due.activo', '?', 1)
            ->set('due.autor', '?', $parametros['autor'])
            ->where('due.idusuarioestructura = ?', $parametros['idrelacion'])
            ->execute();
        return 1;
    }

    public function listarAsocUserEstruc($parametros)
    {
        $cadenaSELECT = '';
        $cadenaJOIN = '';
        $cadenaWHERE = '';
        $cadenaQUERY = '';
        $cadenaSELECT
            = " SELECT *, CASE WHEN due.idusuario = {$parametros['idusuario']} 
                THEN 1 ELSE 0 END  AS superior ";
        $cadenaJOIN = " FROM mod_objetivos.dat_usuario_estructura due ";
        $cadenaWHERE
            = " WHERE (due.autor = {$parametros['idusuario']} 
                OR due.idusuario = {$parametros['idusuario']})  ";
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $campo) {
                if ($campo['field'] == 'activo') {
                    if ($campo['data']['value'] == 'Si') {
                        $activo = 1;
                    } else {
                        $activo = 0;
                    }
                    $cadenaWHERE .= " AND due.activo = {$activo}";
                } else {
                    if ($campo['field'] == 'fechaasociacion') {
                        $arrayfechainicio = explode(
                            ' ', $campo['data']['value']
                        );
                        if ($campo['data']['comparison'] == 'lt') {
                            $cadenaWHERE .= " AND due.fechaasociacion < '"
                                . $arrayfechainicio[0] . "' ";
                        } else {
                            if ($campo['data']['comparison'] == 'gt') {
                                $cadenaWHERE .= " AND due.fechaasociacion > '"
                                    . $arrayfechainicio[0] . "' ";
                            } else {
                                if ($campo['data']['comparison'] == 'eq') {
                                    $cadenaWHERE
                                        .= " AND due.fechaasociacion = '"
                                        . $arrayfechainicio[0] . "' ";
                                }
                            }
                        }
                    }
                }
            }
        }
        //Aki termina    
        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $sqlTotal = $cadenaQUERY;
        $cadenaQUERY .= " OFFSET {$parametros['start']} LIMIT {$parametros['limit']} ";
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        $result->total = count(
            $conn->execute($sqlTotal)->fetchAll(PDO::FETCH_ASSOC)
        );
        return $result;
    }


}//fin clase 




