<?php

class DatGrupoNotificaciones extends BaseDatGrupoNotificaciones
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatDestinatario',
            array('local' => 'iddestinatario', 'foreign' => 'iddestinatario')
        );
        $this->HasMany(
            'DatGrupoDestinatario',
            array('local' => 'idgrupo', 'foreign' => 'idgrupo')
        );
    }

    static function getTotal($parentGroup = null, $creadoPor = null)
    {
        $q = Doctrine_Query::create()
            ->select('count(g.idgrupo)')
            ->from('DatGrupoNotificaciones g');
        if ($creadoPor) {
            $q = $q->where('g.creadopor = ?', $creadoPor);
        }
        if ($parentGroup) {
            $q = $q->innerJoin('g.DatGrupoDestinatario gd')
                ->where('gd.iddestinatario = ?', $parentGroup);
        }

        return $q->setHydrationMode(Doctrine :: HYDRATE_SINGLE_SCALAR)->execute(
        );
    }


    public static function cargarGrupos($idusuario, $start, $limit,$idnodo = null)
    {
        $query = Doctrine_Query::create();
        $result = $query->select(
            'gn.idgrupo idcontacto, gn.nombre contacto,
            gn.iddestinatario iddestinatario'
        )
            ->from('DatGrupoNotificaciones gn')
            ->where('gn.creadopor = ?', $idusuario)
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->orderby('contacto');
        if ($idnodo !== null) {
            $result->innerJoin('gn.DatGrupoDestinatario gd')->where(
                'gd.iddestinatario = ?', $idnodo
            );
        }
        $grupos = $result->execute();

        return array('data' => $grupos);
    }
}