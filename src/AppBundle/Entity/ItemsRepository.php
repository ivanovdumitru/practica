<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\QueryBuilder;

class ItemsRepository extends \Doctrine\ORM\EntityRepository
{
    function showItems(){
        $db = $this->createQueryBuilder('Items');
        $query = $db->getQuery();
        return $query->execute();
                
    }
}
