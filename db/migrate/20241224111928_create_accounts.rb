class CreateAccounts < ActiveRecord::Migration[7.1]
  def change
    create_table :accounts do |t|
      t.string :name
      t.string :subdomain
      t.string :state
      t.string :city
      t.string :phone_number

      t.timestamps
    end
  end
end
