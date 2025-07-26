# Created 07/22/2025 by Paulina Salazar.

require 'yaml'

# This class is used to import categories from the YAML file.
class CategoryImporter
  # Load categories from YAML file
  CATEGORIES = YAML.load_file(Rails.root.join('config', 'yelp_categories.yml'))["categories"]

  # Created 07/22/2025 by Paulina Salazar.
  #
  # Imports categories from YAML file into database.
  def self.import_all
    CATEGORIES.each do |category_name|

      begin
        category = Category.find_or_initialize_by(name: category_name)
        category.save!
        puts "Imported category: #{category.name}"
      rescue StandardError => e
        puts "Error importing category '#{category_name}': #{e.message}"
      end
    end
  end
end
