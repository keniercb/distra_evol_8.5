<?php

class DatComentarioModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(
        $idcomentario, $idelemento, $idtipocomentario, $idtipodocumento,
        $asunto, $descripcion, $fechacreado, $idusuario
    )
    {
        $comentario = new DatComentario();
        //Crear los atributos de comentario
        if ($idcomentario) {
            $comentario = Doctrine::getTable('DatComentario')->find(
                $idcomentario
            );
        } else {
            $comentario = new DatComentario();
            $comentario->idtipocomentario = $idtipocomentario;
            $comentario->idtipodocumento = $idtipodocumento;
            $comentario->idelemento = $idelemento;
            $comentario->version = 1;
            $comentario->idusuario = $idusuario;
            $comentario->estadorevision = 0;
        }
        //seteo parámetros
        $comentario->asunto = $asunto;
        $comentario->descripcion = $descripcion;

        $comentario->fechacreado = $fechacreado;


        //adiciona el nuevo comentario
        $comentario->save();
    }

    public function Actualizar(DatComentario $DatComentario)
    {
        $DatComentario->save();
    }

    public function Eliminar($idcomentario)
    {
        $comentario = new DatComentario();
        $comentario = Doctrine::getTable('DatComentario')->find($idcomentario);
        $comentario->delete();
    }

    public function Listar($start, $limit, $idelemento, $parametros)
    {

        $dat->total = DatComentario::getTotal($idelemento);
        $dat->data = DatComentario::listarComentarios(
            $idelemento, $start, $limit, $parametros
        );
        $count = count($dat->data);
        $array = array();

        for ($i = 0; $i < $count; $i++) {
            $array[$i] [idcomentario] = $dat->data[$i][idcomentario];

            $array [$i][idtipodocumento] = $dat->data[$i][idtipodocumento];
            $array[$i] [asunto] = $dat->data[$i][asunto];
            $array [$i][descripcion] = $dat->data[$i][descripcion];
            $array[$i] [fechacreado] = $dat->data[$i][fechacreado];
            $array[$i] [idusuario] = $dat->data[$i][idusuario];
            $user = $this->integrator->seguridad->nombreUsuario(
                $dat->data[$i][idusuario]
            );

            $array[$i][usuario] = $user;

        }

        return array('total' => $dat->total, 'data' => $array);
    }
}
